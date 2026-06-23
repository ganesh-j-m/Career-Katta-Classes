import crypto from 'crypto';

export const generateZegoToken = (appId, serverSecret, roomId, userId) => {
    const expireTime = Math.floor(Date.now() / 1000) + 3600;
    const nonce = Math.floor(Math.random() * 4294967295);
    
    const header = Buffer.alloc(8);
    header.writeUInt32BE(parseInt(appId), 0);
    header.writeUInt32BE(nonce, 4);
    
    const payload = JSON.stringify({
        room_id: roomId,
        privilege: { 1: 1, 2: 1 },
        stream_id_list: null
    });
    
    const content = [
        parseInt(appId).toString(),
        userId.toString(),
        nonce.toString(),
        expireTime.toString(),
        payload
    ].join('\n');
    
    const hmac = crypto.createHmac('sha256', serverSecret);
    hmac.update(content);
    const hash = hmac.digest('hex');
    
    const tokenData = {
        ver: 1,
        expired_ts: expireTime,
        nonce: nonce,
        hash: hash
    };
    
    return Buffer.from(JSON.stringify(tokenData)).toString('base64');
};