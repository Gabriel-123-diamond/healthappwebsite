import { VertexAI } from '@google-cloud/vertexai';

const project = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const location = 'us-central1'; // Standard location for Vertex AI
const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

if (!project) {
  throw new Error("NEXT_PUBLIC_FIREBASE_PROJECT_ID is not defined");
}

if (!serviceAccountJson) {
  throw new Error("FIREBASE_SERVICE_ACCOUNT_JSON is not defined");
}

let credentials;
try {
  // Remove potential surrounding quotes from environment variable string
  const cleanedJson = serviceAccountJson.trim().replace(/^['"]|['"]$/g, '');
  credentials = JSON.parse(cleanedJson);
  
  // Ensure the private key handles newlines correctly if present
  if (credentials.private_key) {
    credentials.private_key = credentials.private_key.replace(/\\n/g, '\n');
  }
} catch (e) {
  throw new Error(`Failed to parse FIREBASE_SERVICE_ACCOUNT_JSON for Gemini: ${e instanceof Error ? e.message : 'Unknown error'}`);
}

// Initialize Vertex AI with Service Account Credentials
const vertexAI = new VertexAI({
  project: project,
  location: location,
  googleAuthOptions: {
    credentials: credentials
  }
});

export const getGeminiModel = (modelName: string = "gemini-2.5-flash") => {
  // Vertex AI often uses specific version tags like -001, but the base name is more stable
  return vertexAI.getGenerativeModel({ model: modelName });
};