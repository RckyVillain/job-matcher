import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(request: Request) {
    try {
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
            You are a strict ATS (Applicant Tracking System) Expert and Resume Coach.
            Your task is to analyze the user's Resume (PDF attached) against the Job Description below.

            Job Description:
            ${jobLink}

            Instructions:
            1. Identify 3-5 critical keywords or skills missing from the resume that are present in the job description.
            2. Provide actionable advice on formatting or phrasing tweaks to improve ATS parsing.
            3. Give a brief, constructive critique of the user's current resume in relation to this role.
            4. IMPORTANT: The entire advice MUST be written in ${languageInstruction}. Formatting should be easy to read (use markdown bullet points).
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-1.5-flash',
            contents: [
                prompt,
                { inlineData: { data: base64Data, mimeType: 'application/pdf' } }
            ]
        });

        const advice = response.text || "Failed to generate coaching advice.";

        return NextResponse.json({ advice });
    } catch (error: any) {
        console.error("API Route Error:", error);
        return NextResponse.json({ error: 'An error occurred while processing your request.' }, { status: 500 });
    }
}
