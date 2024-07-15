function bufferToHex(buffer) {
    return [...new Uint8Array(buffer)]
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

function hexToBuffer(hex) {
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < bytes.length; i++) {
        bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
    }
    return bytes.buffer;
}

async function generateAesKey() {
    return await crypto.subtle.generateKey(
        { name: 'AES-GCM', length: 256 },
        true,
        ['encrypt', 'decrypt']
    );
}

async function generateSha256KeyPair() {
    return await crypto.subtle.generateKey(
        { name: 'RSA-OAEP', modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' },
        true,
        ['encrypt', 'decrypt']
    );
}

async function encryptAesKeyWithPublicKey(aesKey, publicKey) {
    const exportedAesKey = await crypto.subtle.exportKey('raw', aesKey);
    return await crypto.subtle.encrypt(
        { name: 'RSA-OAEP' },
        publicKey,
        exportedAesKey
    );
}

async function decryptAesKeyWithPrivateKey(encryptedAesKey, privateKey) {
    const decryptedAesKey = await crypto.subtle.decrypt(
        { name: 'RSA-OAEP' },
        privateKey,
        encryptedAesKey
    );
    return await crypto.subtle.importKey(
        'raw',
        decryptedAesKey,
        { name: 'AES-GCM' },
        true,
        ['encrypt', 'decrypt']
    );
}

function downloadPrivateKey(privateKeyHex) {
    const privateKeyBuffer = new Uint8Array(privateKeyHex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
    const blob = new Blob([privateKeyBuffer], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'private_key.pem';
    a.click();
    URL.revokeObjectURL(url);
}

async function encryptStringWithAesKey(input, aesKey) {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encodedInput = new TextEncoder().encode(input);
    const encryptedText = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv: iv },
        aesKey,
        encodedInput
    );
    return { encryptedText: bufferToHex(encryptedText), iv: bufferToHex(iv) };
}

function readKeyFromFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const keyHex = [...new Uint8Array(event.target.result)]
                .map(b => b.toString(16).padStart(2, '0'))
                .join('');
            resolve(keyHex);
        };
        reader.onerror = (event) => {
            reject(new Error('Error reading file'));
        };
        reader.readAsArrayBuffer(file);
    });
}

export async function GenerateAccountKeyPair(pb) {
    const existingPublicKey = pb.authStore.model.pkey
    if (existingPublicKey !== "") {
        return Error("A Key Pair already exists!")
    }
    const keyPair = await generateSha256KeyPair();
    const privateKey = await crypto.subtle.exportKey('pkcs8', keyPair.privateKey);
    const privateKeyHex = bufferToHex(privateKey);
    downloadPrivateKey(privateKeyHex);

    const publicKey = await crypto.subtle.exportKey('pkcs8', keyPair.publicKey);
    const publicKeyHex = bufferToHex(publicKey);
    pb.collections("user").update(pb.authStore.model.id, { "pkey": publicKeyHex })
}

export async function EncryptPageContent(content, encryptionData, pb) {
    if (!content || content === "") return Error("No page content")

    const publicKey = pb.authStore.model.pkey
    if (!publicKey) return Error("No public key found, please generate one from the settings menu")

    let encData = encryptionData

    if (!encData) {
        const aesKey = await generateAesKey();
        const encryptedAesKey = await encryptAesKeyWithPublicKey(aesKey, publicKey);
        encData = { ...encData, "aes": encryptedAesKey }

    }



}
