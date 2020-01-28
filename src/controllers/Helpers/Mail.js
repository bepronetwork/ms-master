var SibApiV3Sdk = require('sib-api-v3-sdk');

var defaultClient = SibApiV3Sdk.ApiClient.instance;

// Configure API key authorization: api-key
var apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.SENDINBLUE_API_KEY

// Configure API key authorization: partner-key
var partnerKey = defaultClient.authentications['partner-key'];
partnerKey.apiKey = process.env.SENDINBLUE_API_KEY


class Mail {
    
    constructor(){

    }

    async sendEmail(email) {
        return new Promise((resolve, reject) => {
            let api = new SibApiV3Sdk.SendEmail();
            api.emailTo(email)
            .exec( (err, item) => {
                if(err){reject(err)}
                resolve(item);
            })
        })

    }
}

export default Mail;