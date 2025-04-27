import { vertex } from '@ai-sdk/google-vertex';
import { experimental_generateImage as generateImage } from 'ai';

export default async function handler(req, res) {
  // CORS headers (as before)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

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

    const model = vertex.image('imagen-3.0-generate-001', { // Using 'imagen-3.0-generate-001' as per the doc
      project: projectId,
      location: location,
      googleAuthOptions: {
        credentials: {
          client_email: googleCredentials.client_email,
          private_key: googleCredentials.private_key.replace(/\\n/g, '\n'),
        },
      },
    });

    const imageResult = await generateImage({
      model,
      prompt: prompt,
      aspectRatio: '16:9', // Or another supported aspect ratio
      // You can add other providerOptions here if needed, e.g., negativePrompt, safetySetting
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