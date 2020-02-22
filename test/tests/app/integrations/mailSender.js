import {
    getApp,
    editAppMailSenderIntegration
} from '../../../methods';
import chai from 'chai';
import models from '../../../models';
import { mochaAsync } from '../../../utils';
import faker from 'faker';

const expect = chai.expect;

context('Mail Sender', async () =>  {
    var admin, app;


    before( async () =>  {
        app = global.test.app;
        admin = global.test.app;
    });

    it('should update the Mail Sender integration info from app', mochaAsync(async () => {
        let postData = {
            app : app.id,
            templateIds : [
                { "template_id": 1, "functionName": "USER_REGISTER", "contactlist_Id"  : 2 },
                { "template_id": 2, "functionName": "USER_LOGIN", "contactlist_Id"  : 2 },
                { "template_id": 3, "functionName": "USER_RESET_PASSWORD", "contactlist_Id"  : 2 }
            ],
            apiKey : "erwerwerwerwerwewerwerwewerwewerwerwerwewe"
        }
        let res = await editAppMailSenderIntegration(postData, app.bearerToken , {id : app.id});
        expect(res.data.status).to.equal(200);
    })); 
});
