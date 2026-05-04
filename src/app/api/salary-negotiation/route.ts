import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
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
            You are an Expert Career Coach and HR Negotiator.
            Analyze the user's Resume (PDF attached) against the Job Description below.

            Job Description:
            ${jobLink}

            Instructions:
            1. Based on the user's experience and the job's seniority, provide a realistic strategy for negotiating salary or benefits.
            2. Write a professional, polite, yet firm "Salary Negotiation Script" (an email draft) that the user can send to the recruiter.
            3. Include placeholders like [Expected Salary] for them to fill in.
            4. IMPORTANT: The entire response MUST be written in ${languageInstruction}.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-1.5-pro',
            contents: [
                prompt,
                { inlineData: { data: base64Data, mimeType: 'application/pdf' } }
            ]
        });

        const advice = response.text || "Failed to generate salary script.";
        return NextResponse.json({ advice });
    } catch (error: any) {
        console.error("API Route Error:", error);
        return NextResponse.json({ error: 'An error occurred while processing your request.' }, { status: 500 });
    }
}
