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
            You are an Expert Career Coach and Copywriter.
            Write a highly tailored, professional Cover Letter for the user based on their Resume (PDF attached) and the Job Description below.

            Job Description:
            ${jobLink}

            Instructions:
            1. Write an engaging opening that states the position applied for.
            2. Match the user's past experience and skills from the resume directly to the needs stated in the job description.
            3. Show enthusiasm for the company and the role.
            4. Keep it concise, no more than 3-4 short paragraphs.
            5. Provide placeholder like [Your Name], [Company Name] where appropriate.
            6. IMPORTANT: The entire cover letter MUST be written in ${languageInstruction}.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-1.5-flash',
            contents: [
                prompt,
                { inlineData: { data: base64Data, mimeType: 'application/pdf' } }
            ]
        });

        const coverLetter = response.text || "Failed to generate cover letter.";

        return NextResponse.json({ coverLetter });
    } catch (error: any) {
        console.error("API Route Error:", error);
        return NextResponse.json({ error: 'An error occurred while processing your request.' }, { status: 500 });
    }
}
