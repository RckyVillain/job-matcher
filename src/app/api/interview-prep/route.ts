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

        const formData = await request.formData();
        const jobLink = formData.get('jobLink') as string;
        const resumeFile = formData.get('resume') as File;
        const lang = formData.get('lang') as string || 'en';

        if (!jobLink || !resumeFile) {
            return NextResponse.json({ error: 'Job description and resume are required.' }, { status: 400 });
        }

        const arrayBuffer = await resumeFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64Data = buffer.toString('base64');
        const languageInstruction = lang === 'id' ? 'Bahasa Indonesia' : lang === 'zh' ? 'Mandarin Simplified' : 'English';

        const prompt = `
            You are an Expert Technical Interviewer and Career Coach.
            Analyze the user's Resume (PDF attached) against the Job Description below.

            Job Description:
            ${jobLink}

            Instructions:
            1. Predict the 5 most difficult interview questions the user might face for this specific role, considering their experience gaps or strengths.
            2. For each question, provide a brief strategy on how to answer it using the STAR method (Situation, Task, Action, Result).
            3. Provide one final tip for building confidence.
            4. IMPORTANT: The entire response MUST be written in ${languageInstruction}. Format nicely with Markdown.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-1.5-pro', // Using pro model for premium feature simulation
            contents: [
                prompt,
                { inlineData: { data: base64Data, mimeType: 'application/pdf' } }
            ]
        });

        const advice = response.text || "Failed to generate interview prep.";
        return NextResponse.json({ advice });
    } catch (error: any) {
        console.error("API Route Error:", error);
        return NextResponse.json({ error: 'An error occurred while processing your request.' }, { status: 500 });
    }
}
