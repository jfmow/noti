const compressImage = async (file, maxSizeKB) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = document.createElement('img');
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                // Calculate the new dimensions to maintain aspect ratio
                let { width, height } = img;
                const maxDimension = Math.max(width, height);
                if (maxDimension > 2000) {
                    const scaleFactor = 2000 / maxDimension;
                    width *= scaleFactor;
                    height *= scaleFactor;
                }

                // Set the canvas dimensions
                canvas.width = width;
                canvas.height = height;

                // Draw the image on the canvas
                ctx.drawImage(img, 0, 0, width, height);

                // Compress the canvas image as a data URL
                canvas.toBlob(
                    (compressedBlob) => {
                        resolve(compressedBlob);
                    },
                    'image/jpeg',
                    0.8 // Adjust the compression quality as desired (0.8 means 80% compression)
                );
            };
            img.onerror = (error) => {
                reject(error);
            };
            img.src = event.target.result;
        };
        reader.onerror = (error) => {
            reject(error);
        };
        reader.readAsDataURL(file);
    });
};

export default compressImage;