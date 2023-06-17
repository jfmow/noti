export default function createKey() {
    const keySize = 128 / 8; // Key size in bytes
    const key = lib.WordArray.random(keySize);
    const encryptionKey = enc.Hex.stringify(key);
    return encryptionKey
}