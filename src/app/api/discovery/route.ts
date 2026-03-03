import { NextResponse } from 'next/server';
import { getGeminiModel } from "@/lib/gemini";

export async function POST(req: Request) {
  try {
    const { answers } = await req.json();

    const model = getGeminiModel("gemini-1.5-flash");

    const prompt = `
      You are an advanced AI health discovery assistant for IKIKE HEALTH AI.
      Based on the following user symptoms and data, provide a professional, educational summary of potential wellness paths.
      
      User Data:
      - Primary Area of Discomfort: ${answers.primary}
      - Severity: ${answers.severity}
      - Duration: ${answers.duration}
      
      Requirements:
      1. Provide a concise summary (max 3 sentences).
      2. Suggest EXACTLY ONE professional specialty from this list: "Cardiologist", "Dermatologist", "Neurologist", "Psychiatrist", "Orthopedist", "Pediatrician", "Dentist", "Ophthalmologist", "General Practitioner", "Nutritionist", "Natural Wellness Practitioner".
      3. Format the output as JSON:
      {
        "summary": "The educational summary text...",
        "suggestedSpecialty": "The Exact Specialty Name"
      }
      
      MAINTAIN A STRICT EDUCATIONAL TONE. Do not provide a medical diagnosis.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean JSON from response (sometimes Gemini adds ```json ... ```)
    const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const data = JSON.parse(jsonStr);

    return NextResponse.json(data);
  } catch (error) {
    console.error("Discovery API Error:", error);
    return NextResponse.json({ 
      summary: "We encountered a technical connection error. Based on common patterns, we recommend consulting a specialist if your discomfort persists.",
      suggestedSpecialty: "General Practitioner"
    }, { status: 200 });
  }
}
