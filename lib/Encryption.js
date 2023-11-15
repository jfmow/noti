export const PageEncryption = {
    async generateKeyPair() {
        const keyPair = await crypto.subtle.generateKey(
            {
                name: "RSA-OAEP",
                modulusLength: 2048,
                publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
                hash: { name: "SHA-256" },
            },
            true,
            ["encrypt", "decrypt"]
        );

        return keyPair;
    },
    async exportPublicKey(key) {
        const exportedKey = await crypto.subtle.exportKey("spki", key);
        return arrayBufferToBase64(exportedKey);
    },
    async importPublicKey(key) {
        const importedPublicKey = await crypto.subtle.importKey(
            "spki",
            base64ToArrayBuffer(key),
            { name: "RSA-OAEP", hash: { name: "SHA-256" } },
            true,
            ["encrypt"]
        );
        return importedPublicKey;
    },
    async exportPrivateKey(key) {
        const exportedKey = await crypto.subtle.exportKey("pkcs8", key);
        return arrayBufferToBase64(exportedKey);
    },
    async importPrivateKey(key) {
        const importedPrivateKey = await crypto.subtle.importKey(
            "pkcs8",
            base64ToArrayBuffer(key),
            { name: "RSA-OAEP", hash: { name: "SHA-256" } },
            true,
            ["decrypt"]
        );
        return importedPrivateKey;
    },
    async decrypt(encrypted, privateKey) {
        const decryptedArrayBuffer = await crypto.subtle.decrypt(
            { name: "RSA-OAEP" },
            privateKey,
            base64ToArrayBuffer(encrypted)
        );
        const decryptedText = new TextDecoder().decode(decryptedArrayBuffer);
        return decryptedText;
    },
    async encrypt(text, publicKey) {
        const encodedText = new TextEncoder().encode(text);
        const encrypted = await crypto.subtle.encrypt(
            { name: "RSA-OAEP" },
            publicKey,
            encodedText
        );
        return arrayBufferToBase64(encrypted);
    },
};

function arrayBufferToBase64(buffer) {
    const binary = String.fromCharCode.apply(null, new Uint8Array(buffer));
    return btoa(binary);
}

function base64ToArrayBuffer(base64) {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
}

export function EncryptionEnabled() {
    return JSON.parse(window.localStorage.getItem('flags'))?.encryption
}

export async function EncryptData(data) {
    try {
        const publicKey = JSON.parse(window.localStorage.getItem('encryption')).publickey
        const importedPublicKey = await PageEncryption.importPublicKey(publicKey)
        const encrypted = await PageEncryption.encrypt(data, importedPublicKey)

        return encrypted
    } catch (err) {
        console.error('Failed to encrypt data!', err)
        return data
    }
}
export async function DecryptData(data) {
    try {
        const privateKey = JSON.parse(window.localStorage.getItem('encryption')).privateKey
        const importedPrivateKey = await PageEncryption.importPrivateKey(privateKey)
        const decrypted = await PageEncryption.decrypt(data, importedPrivateKey)

        return decrypted
    } catch (err) {
        console.log(err)
        return JSON.stringify(data)
    }
}