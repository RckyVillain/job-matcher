import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const jobLink = formData.get('jobLink') as string;
    const resumeFile = formData.get('resume') as File;

    if (!jobLink || !resumeFile) {
      return NextResponse.json(
        { error: 'Job description and resume are required.' },
        { status: 400 }
      );
    }

    // Convert PDF to base64 inline data for Gemini
    const arrayBuffer = await resumeFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Data = buffer.toString('base64');

    const prompt = `
      You are an expert ATS-friendly Resume Writer and Career Coach. 
      Your task is to analyze the provided Job Description and the user's Resume (PDF attached).
      
      Job Description / Link Text:
      ${jobLink}

      Instructions:
      1. Identify the key skills, keywords, and qualifications required for the job.
      2. Review the user's resume carefully.
      3. Rewrite the user's experience bullet points to be highly tailored for this specific job.
      4. Ensure you use strong action verbs and include metrics where possible based on the user's experience.
      5. Output ONLY a JSON array of strings, where each string is an optimized bullet point. Do not include markdown blocks like \`\`\`json. Just the raw array. Example: ["Developed scalable APIs using Node.js...", "Led a team of 5 engineers..."]
    `;

    // Call Gemini API using the new @google/genai SDK
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
    { text: prompt },
    {
        inlineData: {
            data: base64Data,
            mimeType: 'application/pdf',
        }
    }
]

    });

    const responseText = response.text || "[]";
    let bullets: string[] = [];
    
    try {
        // Basic cleanup if the model still includes markdown
        const cleanedText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        bullets = JSON.parse(cleanedText);
    } catch (parseError) {
        console.error("Failed to parse Gemini response as JSON:", responseText);
        bullets = [responseText]; // Fallback to raw text if not JSON
    }

    // Example of proper logging for critical solution
    console.log(JSON.stringify({
        level: 'info',
        event: 'resume_tailored',
        timestamp: new Date().toISOString(),
        bulletsGenerated: bullets.length,
    }));

    return NextResponse.json({ bullets });
  } catch (error: any) {
    console.error("API Route Error:", error);
    return NextResponse.json(
      { error: 'An error occurred while processing your request.' },
      { status: 500 }
    );
  }
}
