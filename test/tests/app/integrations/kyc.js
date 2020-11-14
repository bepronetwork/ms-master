import {
    editKycIntegration
} from '../../../methods';
import chai from 'chai';
import { mochaAsync } from '../../../utils';
import IntegrationsRepository from '../../../../src/db/repos/integrations';

const expect = chai.expect;

context('Kyc', async () =>  {
    var app, admin;


    before( async () =>  {
        app = global.test.app;
        admin = global.test.admin;
    });

    it('should Edit Kyc', mochaAsync(async () => {
        let integrations = await IntegrationsRepository.prototype.findById(app.integrations)
        let postData = {
            kyc_id        : integrations.kyc,
            admin         : admin.id,
            app           : app.id,
            clientId      : "fsdfsdfsd",
            flowId        : "sfsdfsdff",
            client_secret : "sdfsdfsdf",
            isActive      : true
        }
        let res = await editKycIntegration(postData , admin.security.bearerToken , {id : admin.id})
        expect(res.data.status).to.equal(200);
    }));
});
