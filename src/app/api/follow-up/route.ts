import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { getServerSession } from 'next-auth';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(request: Request) {
    try {
        const session = await getServerSession();
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { companyName, position, status, notes, lang } = body;

        const languageInstruction = lang === 'id' ? 'Bahasa Indonesia' : lang === 'zh' ? 'Mandarin Simplified' : 'English';

        const prompt = `
            You are a Professional Career Assistant.
            The user wants to send a follow-up email to a company they applied to.
            
            Details:
            Company: ${companyName}
            Position: ${position}
            Current Application Status: ${status}
            User's Notes: ${notes}

            Instructions:
            Write a polite, professional, and concise follow-up email asking about the status of their application or next steps.
            Include placeholders like [Your Name], [Date you applied].
            IMPORTANT: The entire email MUST be written in ${languageInstruction}.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-1.5-flash',
            contents: [prompt]
        });

        const emailDraft = response.text || "Failed to generate email.";
        return NextResponse.json({ emailDraft });
    } catch (error: any) {
        console.error("API Route Error:", error);
        return NextResponse.json({ error: 'An error occurred while processing your request.' }, { status: 500 });
    }
}
