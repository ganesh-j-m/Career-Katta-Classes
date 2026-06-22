import crypto from 'crypto';

export const generateZegoToken = (appId, serverSecret, roomId, userId) => {
    const effectiveTime = 3600;
    const currentTime = Math.floor(Date.now() / 1000);
    const expireTime = currentTime + effectiveTime;

    const nonce = Math.floor(Math.random() * 2147483647);
    
    const tokenInfo = {
        app_id: parseInt(appId),
        user_id: userId.toString(),
        nonce: nonce,
        ctime: currentTime,
        expire: expireTime,
        payload: ''
    };

    const plainText = JSON.stringify(tokenInfo);
    const secretBuffer = Buffer.from(serverSecret, 'utf8');
    const key = secretBuffer.slice(0, 32);
    const iv = crypto.randomBytes(16);
    
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(plainText, 'utf8');
    encrypted = Buffer.concat([encrypted, cipher.final()]);

    const result = Buffer.concat([
        Buffer.from([0, 4]),
        Buffer.from(new Uint32Array([expireTime]).buffer).reverse(),
        iv,
        encrypted
    ]);

    return result.toString('base64');
};