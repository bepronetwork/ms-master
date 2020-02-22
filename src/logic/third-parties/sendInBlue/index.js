var SibApiV3Sdk = require('sib-api-v3-sdk');

var defaultClient = SibApiV3Sdk.ApiClient.instance;

// Configure API key authorization: api-key
var apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.SENDINBLUE_API_KEY
// apiKey.apiKey = "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"

// Configure API key authorization: partner-key
var partnerKey = defaultClient.authentications['partner-key'];
partnerKey.apiKey = process.env.SENDINBLUE_API_KEY
// partnerKey.apiKey = "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"


class SendInBlue {

    constructor() { }

    async loadingApiKey(unhashed_apiKey) {
        apiKey.apiKey = unhashed_apiKey
        partnerKey.apiKey = unhashed_apiKey
    }

    async createFolder(name) {
        const apiInstance = new SibApiV3Sdk.ContactsApi();
        // let name = "Test Folder"
        let createFolder = {name};
        const data = await apiInstance.createFolder(createFolder);
        return console.log(data);
    }

    async getFolders() {
        const apiInstance = new SibApiV3Sdk.ContactsApi();
        let limit = 10;
        let offset = 0;
        const data = await apiInstance.getFolders(limit, offset);
        return console.log(data);
    }

    async createList() {
        const apiInstance = new SibApiV3Sdk.ContactsApi();
        let name = "Test List";
        let folderId = 3;
        let createList = { name, folderId };
        const data = await apiInstance.createList(createList);
        return console.log(data);
    }

    async getLists() {
        const apiInstance = new SibApiV3Sdk.ContactsApi();
        const data = await apiInstance.getLists();
        return console.log(data);
    }

    async createAttribute(attributeName) {
        const apiInstance = new SibApiV3Sdk.ContactsApi();
        let attributeCategory = "normal";
        // let attributeName = "TOKEN";
        let type = "text";
        let createAttribute = {type};
        const data = await apiInstance.createAttribute(attributeCategory, attributeName, createAttribute);
        return data;
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

    async getSmtpTemplates() {
        const apiInstance = new SibApiV3Sdk.SMTPApi();
        const data = await apiInstance.getSmtpTemplates();
        return console.log(data);
    }

    async sendTemplate(templateId, emailTo) {
        const apiInstance = new SibApiV3Sdk.SMTPApi();
        const sendEmail = { emailTo };
        const data = await apiInstance.sendTemplate(templateId, sendEmail);
        return data;
    }
}

export default SendInBlue;