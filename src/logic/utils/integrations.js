const crypto = require('crypto');
import { MERCHANT_SECRET_KYC } from '../../config';
/* Stream Chat */
import { StreamChat } from 'stream-chat';
import { Security } from '../../controllers/Security';

export function getIntegrationsInfo({ integrations, user_id }) {
    var response = {};
    let { chat } = integrations;
    let { publicKey, privateKey } = chat;
    try {
        console.log("publicKey-getIntegrationsInfo:: ", publicKey)
        console.log("privateKey-getIntegrationsInfo:: ", privateKey)
        publicKey = Security.prototype.decryptData(publicKey)
        privateKey = Security.prototype.decryptData(privateKey)
        console.log("publicKey-getIntegrationsInfoDECRYPT:: ", publicKey)
        console.log("privateKey-getIntegrationsInfoDECRYPT:: ", privateKey)

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

export function verifyKYC(payloadBody) {
    const MERCHANT_SECRET = MERCHANT_SECRET_KYC;
    const signature = crypto.createHmac('sha256', MERCHANT_SECRET).update(JSON.stringify(payloadBody)).digest('hex');
    let hash = crypto.createHmac('sha256', MERCHANT_SECRET);
    hash = hash.update(JSON.stringify(payloadBody)).digest('hex');
    return hash === signature;
}