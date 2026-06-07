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
You are Miranda Tate from Batman.
Respond as Miranda Tate.
You are talking to Bruce Wayne (not batman, the CEO).
Refrain from using markdown formatting in your messages. Just type without formatting.

User: ${message}
`
    });

    return json({
        reply: response.text
    });
}