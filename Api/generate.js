import { vertex } from '@ai-sdk/google-vertex';
import { experimental_generateImage as generateImage } from 'ai'; // Note the experimental prefix

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

        const model = vertex.image('gemini-2.0-flash-exp', { // You might need to adjust the model ID here based on what's available for Gemini image generation on Vertex AI
            project: googleCredentials.project_id,
            location: 'us-central1', // As per the earlier recommendation
            // You might need to configure other providerOptions as shown in the docs
        });

        const imageResult = await generateImage({
            model,
            prompt,
            aspectRatio: '16:9', // Example parameter - adjust as needed
            // Add other parameters like `negativePrompt`, `safetySetting`, etc.
        });

        if (imageResult && imageResult.image) { // The result seems to have an `image` property with the URL
            return res.status(200).json({ image: imageResult.image });
        } else {
            return res.status(500).json({ error: 'Failed to generate image' });
        }

    } catch (error) {
        console.error('Error generating image:', error);
        return res.status(500).json({ error: error.message });
    }
}