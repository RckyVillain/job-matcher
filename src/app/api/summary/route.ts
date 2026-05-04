import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const jobLink = formData.get('jobLink') as string;
        const lang = formData.get('lang') as string || 'en';

        if (!jobLink) {
            return NextResponse.json({ error: 'Job description is required.' }, { status: 400 });
        }

        const languageInstruction = lang === 'id' ? 'Bahasa Indonesia' : lang === 'zh' ? 'Mandarin Simplified' : 'English';

        const prompt = `
            You are an expert HR Consultant. Your task is to analyze the following Job Description and break it down into clear, actionable highlights.
            
            Job Description:
            ${jobLink}

            Instructions:
            1. Provide a concise summary of the role.
            2. List the Top 5 Must-Have Skills or Qualifications.
            3. Highlight any unique perks or deal-breakers mentioned.
            4. Format the output clearly with markdown.
            5. IMPORTANT: Your entire response MUST be in ${languageInstruction}.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-1.5-flash',
            contents: [prompt]
        });

        const summary = response.text || "Failed to generate summary.";

        return NextResponse.json({ summary });
    } catch (error: any) {
        console.error("API Route Error:", error);
        return NextResponse.json({ error: 'An error occurred while processing your request.' }, { status: 500 });
    }
}
