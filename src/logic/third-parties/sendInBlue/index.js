import { SENDINBLUE_API_KEY } from '../../../config';
import SibApiV3Sdk from 'sib-api-v3-sdk';

class SendInBlue {

    constructor({key}) { 
        this.key = key;
        this.setAPI();
    }

    setAPI = () => {
        console.log("Key ", this.key);
        this.contactsAPI = this.__getInstanceWithKeysToInstanceType(new SibApiV3Sdk.ContactsApi(), this.key);
        this.smtpAPI = this.__getInstanceWithKeysToInstanceType(new SibApiV3Sdk.SMTPApi(), this.key);
    }

    __getInstanceWithKeysToInstanceType(instanceType, key){
        let instance = instanceType;
        instance.apiClient.authentications['partner-key'].apiKey = key;
        instance.apiClient.authentications['api-key'].apiKey = key;
        return instance;
    }

    async createFolder(name) {
        this.setAPI();
        console.log("this createFolder ", this.key)
        // let name = "Test Folder"
        let createFolder = { name };
        const data = await this.contactsAPI.createFolder(createFolder);
        return data;
    }

    async getFolders() {
        this.setAPI();
        console.log("this getFolders ", this.key)
        let limit = 10;
        let offset = 0;
        const data = await this.contactsAPI.getFolders(limit, offset);
        return data;
    }

    async createList() {
        this.setAPI();
        console.log("this createList ", this.key)
        let name = "Test List";
        let folderId = 3;
        let createList = { name, folderId };
        const data = await this.contactsAPI.createList(createList);
        return data;
    }

    async getLists() {
        this.setAPI();
        console.log("this getLists ", this.key)
        const data = await this.contactsAPI.getLists();
        return data;
    }

    async createAttribute(attributeName) {
        this.setAPI();
        console.log("this createAttribute ", this.key)
        console.log(this.contactsAPI.apiClient.authentications['api-key'])
        let attributeCategory = "normal";
        // let attributeName = "TOKEN";
        let type = "text";
        let createAttribute = { type };
        const data = await this.contactsAPI.createAttribute(attributeCategory, attributeName, createAttribute);
        console.log("done")
        return data;
    }

    async createContact(email, attributes, listIds) {
        this.setAPI();
        console.log("this createContact ", this.key);
        // email       => string with email to create
        // attributes  => object with the attributes what you desire to pass
        // listIds     => array of listIds that this contact will belong
        console.log(this.contactsAPI.apiClient.authentications['api-key'])
        const createContact = { email, attributes, listIds };
        const data = await this.contactsAPI.createContact(createContact);
        console.log("Done");
        return data;
    }

    async updateContact(email, attributes) {
        this.setAPI();
        console.log("this updateContact ", this.key)
        // email => email what you desire to update
        // attributes => parameters what you desire to update
        const updateContact = { attributes }
        const data = await this.contactsAPI.updateContact(email, updateContact);
        return data;
    }

    async getAtributes() {
        this.setAPI();
        console.log("this getAtributes ", this.key)
        const data = await this.contactsAPI.getAttributes();
        return data;
    }

    async getContacts() {
        this.setAPI();
        console.log("this getContacts ", this.key)
        const data = await this.contactsAPI.getContacts();
        return data;
    }

    async getSmtpTemplates() {
        this.setAPI();
        console.log("this getSmtpTemplates ", this.key)
        const data = await this.smtpAPI.getSmtpTemplates();
        return data;
    }

    async sendTemplate(templateId, emailTo) {
        this.setAPI();
        const sendEmail = { emailTo };
        console.log("Templated Key ", this.key);
        const data = await this.smtpAPI.sendTemplate(templateId, sendEmail);
        return data;
    }
}

let SendinBlueSingleton = new SendInBlue({key : SENDINBLUE_API_KEY});

export {
    SendinBlueSingleton, // Default for the APp Itself
    SendInBlue
}