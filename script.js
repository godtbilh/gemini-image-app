document.addEventListener('DOMContentLoaded', () => {
    const promptInput = document.getElementById('promptInput');
    const generateButton = document.getElementById('generateButton');
    const imageOutput = document.getElementById('imageOutput');
    const errorOutput = document.getElementById('errorOutput'); // Make sure this exists in your index.html

    generateButton.addEventListener('click', async () => {
        console.log('Generate button clicked!');

        const prompt = promptInput.value;
        if (!prompt) {
            alert('Please enter a prompt.');
            return;
        }

        imageOutput.src = ""; // Clear previous image
        imageOutput.alt = "";
        errorOutput.textContent = ""; // Clear previous error

        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log('API Response:', data); // Log the response data

                if (data.image) {
                    imageOutput.src = data.image;
                    imageOutput.alt = 'Generated Image';
                } else if (data.error) {
                    errorOutput.textContent = `Error from API: ${data.error}`;
                } else {
                    errorOutput.textContent = 'No image data received from API.';
                }
            } else {
                const errorText = await response.text();
                console.error('API Error:', response.status, response.statusText, errorText);
                errorOutput.textContent = `API Error: ${response.status} - ${response.statusText} - ${errorText}`;
            }

        } catch (error) {
            console.error('Fetch Error:', error);
            errorOutput.textContent = `Fetch Error: ${error.message}`;
        }
    });
});