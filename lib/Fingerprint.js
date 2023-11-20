export async function generateDeviceFingerprint() {
    const encoder = new TextEncoder();
    const data = encoder.encode(
        `${window.navigator.userAgent}${window.navigator.language}${window.screen.width || ''}${window.screen.height || ''}${new Date().getTimezoneOffset()}`
    );

    // Use the SubtleCrypto API for hashing
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);

    // Convert the hash buffer to a hex string
    const hashedFingerprint = Array.from(new Uint8Array(hashBuffer))
        .map(byte => byte.toString(16).padStart(2, '0'))
        .join('');

    return hashedFingerprint;
}
