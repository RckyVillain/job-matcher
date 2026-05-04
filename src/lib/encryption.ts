import crypto from 'crypto';

// The encryption key should be 32 bytes (256 bits) for aes-256-cbc.
// It must be passed via environment variables.
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || crypto.randomBytes(32).toString('hex'); // Fallback for local testing, but warning: random key resets on restart!
const IV_LENGTH = 16; // For AES, this is always 16

export function encryptData(text: string): string {
    if (!text) return text;
    // ensure key is 32 bytes
    const key = Buffer.from(ENCRYPTION_KEY.slice(0, 64), 'hex');
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

export function decryptData(text: string): string {
    if (!text) return text;
    try {
        const key = Buffer.from(ENCRYPTION_KEY.slice(0, 64), 'hex');
        const textParts = text.split(':');
        const iv = Buffer.from(textParts.shift() as string, 'hex');
        const encryptedText = Buffer.from(textParts.join(':'), 'hex');
        const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    } catch (error) {
        console.error("Decryption failed", error);
        return text; // Return original if decryption fails (e.g. was stored unencrypted previously)
    }
}
