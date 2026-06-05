import { GEMINI_API } from '$env/static/private';
import { GoogleGenAI } from '@google/genai';
import { json } from '@sveltejs/kit';

const ai = new GoogleGenAI({
    apiKey: GEMINI_API
});

export async function POST({ request }) {
    const { message } = await request.json();

    const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: `
You are The Oracle from Batman.
Respond as The Oracle.
You are talking to Batman.
Refrain from using markdown formatting in your messages. Just type without formatting.

User: ${message}
`
    });

    return json({
        reply: response.text
    });
}