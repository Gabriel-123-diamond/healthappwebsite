import { NextRequest, NextResponse } from 'next/server';
import { getAIModel } from "@/lib/gemini";
import { verifyAuth, handleAIError } from "@/lib/serverUtils";

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { error } = await verifyAuth(req);
    if (error) return error;

    const { message, history = [] } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const model = getAIModel("chat", "gemini-1.5-flash");

    const prompt = `
You are Ikiké, an intelligent, empathetic health assistant.
User message: ${message}
Conversation history: ${JSON.stringify(history)}

Please provide a helpful, concise response. Do not provide medical diagnoses. Always recommend consulting a real doctor for serious conditions.
`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    return NextResponse.json({ reply: responseText });
  } catch (error) {
    return handleAIError(error, "Chat");
  }
}
