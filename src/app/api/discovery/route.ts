import { NextRequest, NextResponse } from 'next/server';
import { getAIModel } from "@/lib/gemini";
import { verifyAuth, handleAIError } from "@/lib/serverUtils";

export async function POST(req: NextRequest) {
  try {
    const { error } = await verifyAuth(req);
    if (error) return error;

    const { message, history = [] } = await req.json();

    const model = getAIModel("discovery", "gemini-1.5-flash");

    const prompt = `
      You are the "Health Discovery Engine" for IKIKE HEALTH AI. 
      Your goal is to guide the user through a series of questions to understand their wellness concerns and eventually suggest a professional path.

      RULES:
      1. DO NOT provide a medical diagnosis.
      2. If the user mentions an emergency (e.g. chest pain, severe bleeding), tell them to seek immediate emergency care.
      3. Ask ONE follow-up question at a time to narrow down the issue.
      4. After you have enough information (usually 3-4 turns), provide a "Summary" and a "Suggested Specialty".
      5. FORMAT YOUR RESPONSE AS JSON:
      {
        "reply": "Your next question or follow-up...",
        "isFinal": false,
        "summary": null,
        "suggestedSpecialty": null
      }
      OR if you are finished:
      {
        "reply": "I have gathered enough information.",
        "isFinal": true,
        "summary": "Concise 2-sentence educational summary of findings...",
        "suggestedSpecialty": "One from: Cardiologist, Dermatologist, Neurologist, Psychiatrist, Orthopedist, Pediatrician, Dentist, Ophthalmologist, General Practitioner, Nutritionist, Natural Wellness Practitioner"
      }

      CONTEXT:
      User says: "${message}"
      History: ${JSON.stringify(history)}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = (response as any).text();
    
    // Clean JSON from response
    const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const data = JSON.parse(jsonStr);

    return NextResponse.json(data);
  } catch (err) {
    console.error("Discovery API Error:", err);
    return NextResponse.json({ 
      reply: "I'm having trouble connecting to my knowledge base. Would you like to try again?",
      isFinal: false,
      summary: null,
      suggestedSpecialty: null
    }, { status: 200 });
  }
}
