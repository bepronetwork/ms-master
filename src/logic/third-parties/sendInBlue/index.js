var SibApiV3Sdk = require('sib-api-v3-sdk');

var defaultClient = SibApiV3Sdk.ApiClient.instance;

// Configure API key authorization: api-key
var apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.SENDINBLUE_API_KEY

// Configure API key authorization: partner-key
var partnerKey = defaultClient.authentications['partner-key'];
partnerKey.apiKey = process.env.SENDINBLUE_API_KEY


class SendInBlue {

    constructor() {

    }
    async createContact(email, attributes, listIds) {
        // email       => string with email to create
        // attributes  => object with the attributes what you desire to pass
        // listIds     => array of listIds that this contact will belong
        const apiInstance = new SibApiV3Sdk.ContactsApi();
        const createContact = { email, attributes, listIds };
        const data = await apiInstance.createContact(createContact);
        return data;
    }

    async updateContact(email, attributes) {
        // email => email what you desire to update
        // attributes => parameters what you desire to update
        const apiInstance = new SibApiV3Sdk.ContactsApi();
        const updateContact = { attributes }
        const data = await apiInstance.updateContact(email, updateContact);
        return data;
    }

    async getAtributes() {
        const apiInstance = new SibApiV3Sdk.ContactsApi();
        const data = await apiInstance.getAttributes();
        return data;
    }

    async getContacts() {
        const apiInstance = new SibApiV3Sdk.ContactsApi();
        const data = await apiInstance.getContacts();
        return data;
    }

    async getSmtpTemplates(){
        const apiInstance = new SibApiV3Sdk.SMTPApi();
        const data = await apiInstance.getSmtpTemplates();
        return console.log(data);
    }

    async sendTemplate(templateId, emailTo) {
        const apiInstance = new SibApiV3Sdk.SMTPApi();
        const sendEmail = {emailTo};
        const data = await apiInstance.sendTemplate(templateId, sendEmail);
        return data;
    }
}

export default SendInBlue;