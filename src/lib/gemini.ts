import { VertexAI } from '@google-cloud/vertexai';
import { GoogleGenerativeAI } from '@google/generative-ai';

if (typeof window !== 'undefined') {
  throw new Error('gemini.ts can only be imported on the server.');
}

// Config Types
type Provider = 'vertex' | 'gemini';
type Feature = 'search' | 'discovery' | 'chat';

// Vertex Config
const project = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const location = 'us-central1';
const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

let vertexAI: VertexAI | null = null;

function initVertex() {
  if (vertexAI) return vertexAI;
  if (!project || !serviceAccountJson) return null;

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
    return vertexAI;
  } catch (e) {
    console.error("Vertex AI Init Failed:", e);
    return null;
  }
}

// Gemini SDK Config
const apiKey = process.env.GEMINI_API_KEY;
let genAI: GoogleGenerativeAI | null = null;

function initGemini() {
  if (genAI) return genAI;
  if (!apiKey) return null;
  genAI = new GoogleGenerativeAI(apiKey);
  return genAI;
}

/**
 * Core model factory that respects independent provider switches
 */
export const getAIModel = (feature: Feature, modelName?: string) => {
  // Determine provider based on feature
  let provider: Provider = 'gemini';
  if (feature === 'search') provider = (process.env.AI_PROVIDER_SEARCH as Provider) || 'gemini';
  if (feature === 'discovery') provider = (process.env.AI_PROVIDER_DISCOVERY as Provider) || 'gemini';
  if (feature === 'chat') provider = (process.env.AI_PROVIDER_CHAT as Provider) || 'gemini';

  const effectiveModel = modelName || "gemini-1.5-flash";

  console.log(`[AI Factory] Feature: ${feature}, Provider: ${provider}, Model: ${effectiveModel}`);

  if (provider === 'gemini') {
    const sdk = initGemini();
    if (!sdk) throw new Error("GEMINI_API_KEY is not defined");
    return sdk.getGenerativeModel({ model: effectiveModel });
  } else {
    const sdk = initVertex();
    if (!sdk) throw new Error("Vertex AI configuration is missing or invalid");
    return sdk.getGenerativeModel({ model: effectiveModel });
  }
};

// Legacy support for older code if any
export const getGeminiModel = (modelName?: string) => getAIModel('search', modelName);
