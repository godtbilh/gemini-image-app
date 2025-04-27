import { vertex } from '@ai-sdk/google-vertex/edge';
import { experimental_generateImage as generateImage } from 'ai';

export default async function handler(req, res) {
  // CORS headers (as before)

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    const googleCredentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);
    const projectId = process.env.GOOGLE_VERTEX_PROJECT;
    const location = process.env.GOOGLE_VERTEX_LOCATION;
    const clientEmail = googleCredentials.client_email;
    const privateKey = googleCredentials.private_key?.replace(/\\n/g, '\n');

    const model = vertex.image('imagen-3.0-generate-001', {
      project: projectId,
      location: location,
      credentials: { // Try passing credentials here even with /edge import
        clientEmail: clientEmail,
        privateKey: privateKey,
      },
    });

    const imageResult = await generateImage({
      model,
      prompt: prompt,
      aspectRatio: '16:9',
    });

    if (imageResult && imageResult.image) {
      return res.status(200).json({ image: imageResult.image });
    } else {
      return res.status(500).json({ error: 'Failed to generate image' });
    }

  } catch (error) {
    console.error('Error in /api/generate:', error);
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}