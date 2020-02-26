import { MailSenderRepository } from "../../db/repos";
import { Security } from "../../controllers/Security";
import { Logger } from "../../helpers/logger";
import { SendInBlue } from "../third-parties/sendInBlue";

class Mailer{
    constructor(){}


    async sendEmail({app_id, user, action, attributes={}}){
        let send = await MailSenderRepository.prototype.findApiKeyByAppId(app_id);
        try{
            if ((send.apiKey != null) && (send.apiKey != undefined)) {
                let template = send.templateIds.find((t) => { return t.functionName == action });
                if(!template){throw new Error(`Email Action ${action} does not exist`)}
                let apiKey = await Security.prototype.decryptData(send.apiKey)

                /* Create Sendinblue Client */
                var sendinBlueClient = new SendInBlue({key : apiKey});

                attributes = {
                    YOURNAME: user.name,
                    ...attributes
                };

                let templateId = template.template_id;
                let listIds = template.contactlist_Id;

                try {
                    await sendinBlueClient.createContact(user.email, attributes, [listIds]);
                } catch (e) {
                    await sendinBlueClient.updateContact(user.email, attributes);
                }
                console.log("templateId", templateId, user.email)
                await sendinBlueClient.sendTemplate(templateId, [user.email]);
                console.log("done")
            }

        }catch(err){
            console.log("err ", err)
            Logger.error(err);
        }
    }


}


export default Mailer;

