const crypto = require('crypto');
/* Stream Chat */
import { StreamChat } from 'stream-chat';
import { Security } from '../../controllers/Security';

export function getIntegrationsInfo({ integrations, user_id }) {
    var response = {};
    let { chat } = integrations;
    let { publicKey, privateKey } = chat;
    try {
        publicKey = Security.prototype.decryptData(publicKey)
        privateKey = Security.prototype.decryptData(privateKey)
    } catch (error) {
        
    }
    /* Stream Chat */
    if (chat && chat.isActive) {
        const serverSideClient = new StreamChat(publicKey, privateKey);
        response.chat = {
            token: serverSideClient.createToken(user_id),
            publicKey: publicKey
        }
    }

    return response;
}
// MERCHANT_SECRET is app id
export function verifyKYC(payloadBody, MERCHANT_SECRET) {
    const signature = crypto.createHmac('sha256', MERCHANT_SECRET).update(JSON.stringify(payloadBody)).digest('hex');
    let hash = crypto.createHmac('sha256', MERCHANT_SECRET);
    hash = hash.update(JSON.stringify(payloadBody)).digest('hex');
    return hash === signature;
}