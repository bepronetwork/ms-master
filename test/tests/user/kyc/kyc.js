import {
    editKycNeeded,
    getUserAuth,
    kycWebhook
} from '../../../methods';
import chai from 'chai';
import { mochaAsync } from '../../../utils';

const expect = chai.expect;

context('Kyc', async () =>  {
    var app, admin, user;


    before( async () =>  {
        app     = global.test.app;
        user    = global.test.user;
        user    = (await getUserAuth({ user: user.id, app: app.id }, user.bearerToken, { id: user.id })).data.message;
        admin   = global.test.admin;
    });

    it('should Edit Kyc', mochaAsync(async () => {
        let postData = {
            admin      : admin.id,
            user       : user.id,
            kyc_needed : true
        }
        let res = await editKycNeeded(postData , admin.security.bearerToken , {id : admin.id})
        expect(res.data.status).to.equal(200);
    }));

    it('should Kyc', mochaAsync(async () => {
        let webhookData = {
            eventName: 'verification_updated',
            details: { age: { data: 25 }, isDocumentExpired: {}},
            identityStatus: 'reviewNeeded',
            matiDashboardUrl: 'https://dashboard.getmati.com/identities/5faec24bc326eb001b29ca58',
            resource: 'https://api.getmati.com/v2/verifications/5faec24bc326eb001b29ca5a',
            status: 'reviewNeeded',
            timestamp: '2020-11-14T15:16:00.914Z'
        }
        await kycWebhook(webhookData);

        let res = await editKycNeeded(postData , admin.security.bearerToken , {id : admin.id})
        expect(res.data.status).to.equal(200);
    }));
});
