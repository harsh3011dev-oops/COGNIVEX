const crypto = require('crypto');
const pdfParse = require('pdf-parse');

const MIN_TEXT_LENGTH = 200;
const MAX_TEXT_CHARS = parseInt(process.env.QUIZ_MAX_TEXT_CHARS, 10) || 12000;

class PdfExtractionError extends Error {
    constructor(message, code, statusCode = 422) {
        super(message);
        this.name = 'PdfExtractionError';
        this.code = code;
        this.statusCode = statusCode;
    }
}

function isPdfBuffer(buffer) {
    return buffer && buffer.length >= 4 && buffer.slice(0, 4).toString() === '%PDF';
}

function normalizeText(text) {
    return text
        .replace(/\0/g, '')
        .replace(/\r\n/g, '\n')
        .replace(/[ \t]+/g, ' ')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
}

function truncateText(text) {
    if (text.length <= MAX_TEXT_CHARS) {
        return { text, truncated: false };
    }
    return { text: text.slice(0, MAX_TEXT_CHARS), truncated: true };
}

/**
 * Extract and normalize text from a PDF buffer.
 * @param {Buffer} buffer
 * @returns {Promise<{ text: string, charCount: number, truncated: boolean, hash: string }>}
 */
async function extractTextFromPdf(buffer) {
    if (!buffer || !Buffer.isBuffer(buffer)) {
        throw new PdfExtractionError('No PDF data provided.', 'NO_PDF_DATA', 400);
    }

    if (!isPdfBuffer(buffer)) {
        throw new PdfExtractionError('Please upload a valid PDF file.', 'INVALID_PDF', 400);
    }

    try {
        // pdf-parse default export: pdfParse(buffer) -> { text, numpages, ... }
        const result = await pdfParse(buffer);
        const normalized = normalizeText(result?.text || '');

        if (normalized.length < MIN_TEXT_LENGTH) {
            throw new PdfExtractionError(
                "Couldn't read text from this PDF. Try a text-based PDF.",
                'PDF_UNREADABLE',
                422
            );
        }

        const { text, truncated } = truncateText(normalized);
        const hash = crypto.createHash('sha256').update(buffer).digest('hex');

        return {
            text,
            charCount: text.length,
            truncated,
            hash,
        };
    } catch (error) {
        if (error instanceof PdfExtractionError) {
            throw error;
        }

        const message = error?.message || '';
        if (/password/i.test(message)) {
            throw new PdfExtractionError(
                'This PDF is password-protected and cannot be processed.',
                'PDF_PASSWORD',
                422
            );
        }

        console.error('PDF extraction error:', message || error);
        throw new PdfExtractionError(
            "Couldn't read text from this PDF. Try a text-based PDF.",
            'PDF_EXTRACTION_FAILED',
            422
        );
    }
}

module.exports = {
    extractTextFromPdf,
    PdfExtractionError,
};
