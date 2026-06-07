const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

/**
 * Send a prompt to Groq API and return the text response.
 * @param {string} prompt - The full prompt string to send.
 * @returns {Promise<string>} - The AI-generated response text.
 */
async function generateAIResponse(prompt) {
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
        temperature: 0.7,
        max_tokens: 1024,
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

module.exports = { generateAIResponse };
