import crypto from 'crypto';

export const generateZegoToken = (appId, serverSecret, roomId, userId) => {
    const expireTime = Math.floor(Date.now() / 1000) + 3600;
    
    const payload = JSON.stringify({
        room_id: roomId,
        privilege: { 1: 1, 2: 1 },
        stream_id_list: null
    });

    const nonce = Math.floor(Math.random() * 4294967295);
    
    const content = `${appId}\n${nonce}\n${expireTime}\n${payload}`;
    
    const hmac = crypto.createHmac('sha256', serverSecret);
    hmac.update(content);
    const signature = hmac.digest('hex');
    
    const tokenData = {
        app_id: parseInt(appId),
        user_id: userId.toString(),
        nonce: nonce,
        ctime: Math.floor(Date.now() / 1000),
        expire: expireTime,
        payload: payload,
        signature: signature
    };
    
    const tokenStr = JSON.stringify(tokenData);
    return '04' + Buffer.from(tokenStr).toString('base64');
};