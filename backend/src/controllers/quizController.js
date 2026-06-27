const db = require('../config/db');
const { extractTextFromPdf, PdfExtractionError } = require('../services/pdf.service');
const { generateQuizFromText, QuizGenerationError, clampQuestionCount } = require('../services/quiz.service');

const generateFromPdf = async (req, res) => {
    const userId = req.user.uid;

    if (!req.file) {
        return res.status(400).json({
            success: false,
            error: 'Please upload a valid PDF file.',
            code: 'NO_FILE',
        });
    }

    const questionCount = clampQuestionCount(req.body?.questionCount);
    const subject = typeof req.body?.subject === 'string' ? req.body.subject.trim() : null;
    const filename = req.file.originalname || 'document.pdf';

    let quizId = null;

    try {
        const extraction = await extractTextFromPdf(req.file.buffer);

        let userProfile = null;
        if (db) {
            const { data, error } = await db
                .from('user_profile')
                .select('*')
                .eq('id', userId)
                .maybeSingle();

            if (error) {
                console.error('Quiz generation profile fetch error:', error.message || error);
            } else {
                userProfile = data;
            }
        }

        const quizResult = await generateQuizFromText(extraction.text, {
            questionCount,
            subject,
            userProfile: userProfile ? { ...userProfile, id: userId } : { id: userId },
        });

        if (!db) {
            return res.status(200).json({
                success: true,
                quizId: null,
                questions: quizResult.questions,
                metadata: {
                    sourceFilename: filename,
                    extractedChars: extraction.charCount,
                    truncated: extraction.truncated,
                    difficulty: quizResult.difficulty,
                    subject: quizResult.subject,
                    questionCount: quizResult.questionCount,
                    persisted: false,
                },
            });
        }

        const { data: quizRow, error: quizInsertError } = await db
            .from('generated_quizzes')
            .insert([{
                user_id: userId,
                source_filename: filename,
                source_hash: extraction.hash,
                extracted_chars: extraction.charCount,
                subject: quizResult.subject,
                difficulty: quizResult.difficulty,
                question_count: quizResult.questionCount,
                status: 'ready',
            }])
            .select()
            .single();

        if (quizInsertError) {
            console.error('generated_quizzes insert error:', quizInsertError.message || quizInsertError);
            throw new Error('Failed to save generated quiz.');
        }

        quizId = quizRow.id;

        const questionRows = quizResult.questions.map((item, index) => ({
            quiz_id: quizId,
            position: index + 1,
            question: item.question,
            options: item.options,
            correct: item.correct,
            topic: item.topic,
            explanation: item.explanation || null,
        }));

        const { error: questionsInsertError } = await db
            .from('quiz_questions')
            .insert(questionRows);

        if (questionsInsertError) {
            console.error('quiz_questions insert error:', questionsInsertError.message || questionsInsertError);
            await db
                .from('generated_quizzes')
                .update({ status: 'failed', error_message: questionsInsertError.message })
                .eq('id', quizId);
            throw new Error('Failed to save quiz questions.');
        }

        return res.status(200).json({
            success: true,
            quizId,
            questions: quizResult.questions,
            metadata: {
                sourceFilename: filename,
                extractedChars: extraction.charCount,
                truncated: extraction.truncated,
                difficulty: quizResult.difficulty,
                subject: quizResult.subject,
                questionCount: quizResult.questionCount,
                persisted: true,
            },
        });
    } catch (error) {
        if (quizId && db) {
            await db
                .from('generated_quizzes')
                .update({
                    status: 'failed',
                    error_message: error.message || 'Quiz generation failed.',
                })
                .eq('id', quizId);
        }

        if (error instanceof PdfExtractionError) {
            return res.status(error.statusCode).json({
                success: false,
                error: error.message,
                code: error.code,
            });
        }

        if (error instanceof QuizGenerationError) {
            return res.status(error.statusCode).json({
                success: false,
                error: error.message,
                code: error.code,
            });
        }

        console.error('generateFromPdf error:', error);
        return res.status(500).json({
            success: false,
            error: 'Quiz generation failed. Please try again.',
            code: 'QUIZ_GENERATION_FAILED',
        });
    }
};

module.exports = { generateFromPdf };
