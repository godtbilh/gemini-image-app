document.addEventListener('DOMContentLoaded', () => {
    const promptInput = document.getElementById('promptInput');
    const generateButton = document.getElementById('generateButton');
    const imageOutput = document.getElementById('imageOutput');

    generateButton.addEventListener('click', async () => {
        console.log('Generate button clicked!'); // ADD THIS LINE

        const prompt = promptInput.value;
        if (!prompt) {
            alert('Please enter a prompt.');
            return;
        }

        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt }),
            });

            // ... rest of your fetch code ...

        } catch (error) {
            console.error('Error generating image:', error);
            imageOutput.textContent = `Error: ${error.message}`;
        }
    });
});