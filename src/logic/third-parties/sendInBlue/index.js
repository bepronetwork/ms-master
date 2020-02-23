import { SENDINBLUE_API_KEY } from '../../../config';
import SibApiV3Sdk from 'sib-api-v3-sdk';

class SendInBlue {

    constructor({key}) { 
        this.key = key;
        console.log("Key ", key);
        this.contactsAPI = this.__getInstanceWithKeysToInstanceType(new SibApiV3Sdk.ContactsApi(), key);
        this.smtpAPI = this.__getInstanceWithKeysToInstanceType(new SibApiV3Sdk.SMTPApi(), key);
    }

    __getInstanceWithKeysToInstanceType(instanceType, key){
        let instance = instanceType;
        instance.apiClient.authentications['partner-key'].apiKey = key;
        instance.apiClient.authentications['api-key'].apiKey = key;
        return instance;
    }

    async createFolder(name) {
        const apiInstance = this.contactsAPI;
        // let name = "Test Folder"
        let createFolder = { name };
        const data = await apiInstance.createFolder(createFolder);
        return data;
    }

    async getFolders() {
        const apiInstance = this.contactsAPI;
        let limit = 10;
        let offset = 0;
        const data = await apiInstance.getFolders(limit, offset);
        return data;
    }

    async createList() {
        const apiInstance = this.contactsAPI;
        let name = "Test List";
        let folderId = 3;
        let createList = { name, folderId };
        const data = await apiInstance.createList(createList);
        return data;
    }

    async getLists() {
        const apiInstance = this.contactsAPI;
        const data = await apiInstance.getLists();
        return data;
    }

    async createAttribute(attributeName) {
        const apiInstance = this.contactsAPI;
        let attributeCategory = "normal";
        // let attributeName = "TOKEN";
        let type = "text";
        let createAttribute = { type };
        const data = await apiInstance.createAttribute(attributeCategory, attributeName, createAttribute);
        return data;
    }

    async createContact(email, attributes, listIds) {
        // email       => string with email to create
        // attributes  => object with the attributes what you desire to pass
        // listIds     => array of listIds that this contact will belong
        const apiInstance = this.contactsAPI;
        const createContact = { email, attributes, listIds };
        const data = await apiInstance.createContact(createContact);
        return data;
    }

    async updateContact(email, attributes) {
        // email => email what you desire to update
        // attributes => parameters what you desire to update
        const apiInstance = this.contactsAPI;
        const updateContact = { attributes }
        const data = await apiInstance.updateContact(email, updateContact);
        return data;
    }

    async getAtributes() {
        const apiInstance = this.contactsAPI;
        const data = await apiInstance.getAttributes();
        return data;
    }

    async getContacts() {
        const apiInstance = this.contactsAPI;
        const data = await apiInstance.getContacts();
        return data;
    }

    async getSmtpTemplates() {
        const apiInstance = this.smtpAPI;
        const data = await apiInstance.getSmtpTemplates();
        return data;
    }

    async sendTemplate(templateId, emailTo) {
        const apiInstance = this.smtpAPI;
        const sendEmail = { emailTo };
        console.log("Templated Key ", this.key);
        const data = await apiInstance.sendTemplate(templateId, sendEmail);
        return data;
    }
}

let SendinBlueSingleton = new SendInBlue({key : SENDINBLUE_API_KEY});

export {
    SendinBlueSingleton, // Default for the APp Itself
    SendInBlue
}