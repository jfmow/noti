import CryptoJS from 'crypto-js';

export function getPosition() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const data = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                };

                try {
                    const response = await fetch('/api/encrypt', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({data})
                    });

                    if (!response.ok) {
                        throw new Error('Failed to encrypt location data');
                    }

                    const encryptedData = await response.json();
                    const encryptedLocation = encryptedData.ciphertext
                    resolve({
                        encryptedLocation
                    });
                } catch (error) {
                    reject(error);
                }
            },
            (error) => {
                reject(error);
            }
        );
    });
}
