import { createVertex } from '@ai-sdk/google-vertex';
import { experimental_generateImage as generateImage } from 'ai';

export default async function handler(req, res) {
  // ... (CORS and method handling) ...

  try {
    const googleCredentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);
    const projectId = process.env.GOOGLE_VERTEX_PROJECT;
    const location = process.env.GOOGLE_VERTEX_LOCATION;
    const clientEmail = googleCredentials.client_email;
    const privateKey = googleCredentials.private_key.replace(/\\n/g, '\n'); // Important: Handle escaped newlines

    const vertex = createVertex({
      project: projectId,
      location: location,
      googleAuthOptions: {
        credentials: {
          client_email: clientEmail,
          private_key: privateKey,
        },
      },
    });

    // ... (rest of your image generation code using vertex.image) ...

  } catch (error) {
    console.error("Error in /api/generate:", error);
    return res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
}