import { VertexAI } from '@google-cloud/vertexai';
import { GoogleGenerativeAI } from '@google/generative-ai';

const provider = process.env.AI_PROVIDER || 'vertex'; // 'vertex' or 'gemini'

// --- Vertex AI Configuration ---
const project = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const location = 'us-central1';
const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

let vertexAI: VertexAI | null = null;

if (provider === 'vertex') {
  if (!project) throw new Error("NEXT_PUBLIC_FIREBASE_PROJECT_ID is not defined");
  if (!serviceAccountJson) throw new Error("FIREBASE_SERVICE_ACCOUNT_JSON is not defined");

  try {
    const cleanedJson = serviceAccountJson.trim().replace(/^['"]|['"]$/g, '');
    const credentials = JSON.parse(cleanedJson);
    if (credentials.private_key) {
      credentials.private_key = credentials.private_key.replace(/\\n/g, '\n');
    }
    vertexAI = new VertexAI({
      project: project,
      location: location,
      googleAuthOptions: { credentials }
    });
  } catch (e) {
    throw new Error(`Failed to initialize Vertex AI: ${e instanceof Error ? e.message : 'Unknown error'}`);
  }
}

// --- Gemini API Key Configuration ---
const apiKey = process.env.GEMINI_API_KEY;
let genAI: GoogleGenerativeAI | null = null;

if (provider === 'gemini') {
  if (!apiKey) throw new Error("GEMINI_API_KEY is not defined (required for 'gemini' provider)");
  // Use stable v1 API version to avoid 404 errors seen on v1beta
  genAI = new GoogleGenerativeAI(apiKey);
}

export const getGeminiModel = (modelName?: string) => {
  // Use strictly assigned defaults based on provider if no modelName is passed
  const effectiveModel = modelName || (provider === 'gemini' ? "gemini-flash-latest" : "gemini-2.5-flash-lite");

  console.log(`[Gemini Config] Provider: ${provider}, Effective Model: ${effectiveModel}`);
  
  if (provider === 'gemini' && genAI) {
    return genAI.getGenerativeModel({ model: effectiveModel });
  } else if (provider === 'vertex' && vertexAI) {
    return vertexAI.getGenerativeModel({ model: effectiveModel });
  }
  throw new Error(`Invalid AI Provider configuration. Provider: ${provider}`);
};