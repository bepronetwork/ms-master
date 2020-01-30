var SibApiV3Sdk = require('sib-api-v3-sdk');

var defaultClient = SibApiV3Sdk.ApiClient.instance;

// Configure API key authorization: api-key
var apiKey = defaultClient.authentications['api-key'];
// apiKey.apiKey = process.env.SENDINBLUE_API_KEY
apiKey.apiKey = "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"

// Configure API key authorization: partner-key
var partnerKey = defaultClient.authentications['partner-key'];
// partnerKey.apiKey = process.env.SENDINBLUE_API_KEY
partnerKey.apiKey = "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"


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

    async addContactsToList(listId, contactEmails) {
        //contactEmails is an array of emails
        //listId insert id (number) from the contact list
        const apiInstance = new SibApiV3Sdk.ContactsApi();
        const data = await apiInstance.addContactToList(listId, contactEmails);
        return data;
    }

    async getAtributes() {
        const apiInstance = new SibApiV3Sdk.ContactsApi();
        const data = await apiInstance.getAttributes();
        return data;
    }

    async getContacts() {
        const apiInstance = await new SibApiV3Sdk.ContactsApi();
        const data = await apiInstance.getContacts();
        return data;
    }

    async getLits() {
        const apiInstance = new SibApiV3Sdk.ContactsApi();
        const data = await apiInstance.getLists();
        return data;
    }

    async sendTestEmail(campaignId, emailTo) {
        //campaignId => Id (number) of the campaign
        //emailTo => If you want to specify who to send email to, put email array
        const campaigns = new SibApiV3Sdk.EmailCampaignsApi();
        const data = await campaigns.sendTestEmail(campaignId, emailTo);
        return data;
    }

    async getCampaign() {
        const apiInstance = new SibApiV3Sdk.EmailCampaignsApi();
        let campaignId = 1;
        const res = await apiInstance.getEmailCampaign(campaignId);
        return res;
    }

    async sendEmailCampaign() {
        const apiInstance = new SibApiV3Sdk.EmailCampaignsApi();
        let campaignId = 1;
        const campaign = await apiInstance.getEmailCampaign(campaignId);
        const subject = campaign.subject
        const body = campaign.htmlContent
        const to = ["matheus@betprotocol.com"]
        const contentType = "html"
        let email = { subject, to, contentType, body }
        email;
        let sendReport = { email }
        const data = await apiInstance.sendReport(campaignId, sendReport);
        return data;
    }

    async updateContact() {
        const apiInstance = new SibApiV3Sdk.ContactsApi();
        const email = "paulohr.abreu@gmail.com";
        const attributes = {
            APP: "5e3312bcd7f0d4316fa083a1"
        };
        const updateContact = {attributes}
        const data = await apiInstance.updateContact(email, updateContact);
        return data);
    }
}

export default SendInBlue;