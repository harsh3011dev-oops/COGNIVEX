const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

/**
 * Send a prompt to Groq and return parsed JSON from the response.
 * @param {string} prompt
 * @param {{ temperature?: number, max_tokens?: number }} [options]
 * @returns {Promise<object>}
 */
async function generateStructuredAIResponse(prompt, options = {}) {
    const text = await generateAIResponse(prompt, {
        temperature: options.temperature ?? 0.3,
        max_tokens: options.max_tokens ?? 4096,
    });

    return parseJsonFromModelText(text);
}

function parseJsonFromModelText(text) {
    if (!text || typeof text !== 'string') {
        throw new Error('Empty AI response.');
    }

    const trimmed = text.trim();
    const fenceMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
    const candidate = fenceMatch ? fenceMatch[1].trim() : trimmed;

    try {
        return JSON.parse(candidate);
    } catch (error) {
        const start = candidate.indexOf('{');
        const end = candidate.lastIndexOf('}');
        if (start !== -1 && end !== -1 && end > start) {
            return JSON.parse(candidate.slice(start, end + 1));
        }
        throw new Error('AI response was not valid JSON.');
    }
}

/**
 * @param {string} prompt
 * @param {{ temperature?: number, max_tokens?: number }} [options]
 * @returns {Promise<string>}
 */
async function generateAIResponse(prompt, options = {}) {
    if (!GROQ_API_KEY) {
        throw new Error('GROQ_API_KEY is not set in environment variables.');
    }

    const requestBody = {
        model: "llama-3.3-70b-versatile",
        messages: [
            {
                role: "user",
                content: prompt
            }
        ],
        temperature: options.temperature ?? 0.7,
        max_tokens: options.max_tokens ?? 1024,
        top_p: 1
    };

    const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${GROQ_API_KEY}`
        },
        body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
        const errorBody = await response.text();
        console.error('Groq API error:', response.status, errorBody);
        throw new Error(`Groq API request failed with status ${response.status}`);
    }

    const data = await response.json();
    const text = data?.choices?.[0]?.message?.content;

    if (!text) {
        throw new Error('No text content in Groq API response.');
    }

    return text;
}

module.exports = { generateAIResponse, generateStructuredAIResponse, parseJsonFromModelText };
