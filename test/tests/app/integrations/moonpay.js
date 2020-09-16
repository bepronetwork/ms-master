import {
    editMoonPayIntegration
} from '../../../methods';
import chai from 'chai';
import { mochaAsync, detectValidationErrors } from '../../../utils';
import IntegrationsRepository from '../../../../src/db/repos/integrations';
const expect = chai.expect;

context('MoonPay', async () =>  {
    var app, admin, user, userPostData;


    before( async () =>  {
        app = global.test.app;
        admin = global.test.admin;
    });

    it('should Edit MoonPay', mochaAsync(async () => {
        let integrations = await IntegrationsRepository.prototype.findById(app.integrations)
        let postData = {
            app: app.id,
            admin: admin.id,
            moonpay_id: integrations.cripsr,
            key: "test",
            isActive: true
        }
        let res = await editMoonPayIntegration(postData , admin.security.bearerToken , {id : admin.id})
        expect(res.data.status).to.equal(200);
    }));
});
