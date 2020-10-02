require('dotenv').config({ path: '../../.env' });
const Cryptr = require('cryptr');
const cryptr = new Cryptr(process.env.PRIVATE_KEY);

class Security {

    constructor(password){
        this.state = {
            password : password
        }
    }

    encryptData(data){
        return cryptr.encrypt(data);
    }

    decryptData(data){
        return cryptr.decrypt(data);
    }
}

module.exports = Security;