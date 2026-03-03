import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
  try {
    const { answers } = await req.json();

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      You are an advanced AI health discovery assistant for IKIKE HEALTH AI.
      Based on the following user symptoms and data, provide a professional, educational summary of potential wellness paths.
      
      User Data:
      - Primary Area of Discomfort: ${answers.primary}
      - Severity: ${answers.severity}
      - Duration: ${answers.duration}
      
      Requirements:
      1. Keep the response concise (max 3 sentences).
      2. MAINTAIN A STRICT EDUCATIONAL TONE. Do not provide a medical diagnosis.
      3. Suggest whether they should see a Natural Wellness Practitioner (herbal/holistic) or a Medical Doctor based on the severity.
      4. If severity is "severe", emphasize immediate medical consultation.
      
      Output only the summary text.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ summary: text });
  } catch (error) {
    console.error("Discovery API Error:", error);
    return NextResponse.json({ error: "Failed to generate health insight" }, { status: 500 });
  }
}
