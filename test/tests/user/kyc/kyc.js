import {
    editKycNeeded,
    getUserAuth,
    kycWebhook,
    loginUser
} from '../../../methods';
import chai from 'chai';
import { mochaAsync } from '../../../utils';

const expect = chai.expect;

context('Kyc', async () =>  {
    var app, admin, user;


    before( async () =>  {
        app     = global.test.app;
        user    = global.test.user;
        user    = await loginUser({username:"sivapof211@x1post.com", password: "sivapof211@x1post.com", app: "5f5295d31534320027631bb4"});
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
        console.log(res);
        expect(res.data.status).to.equal(200);
    }));

    it('should webhook confirm Kyc', mochaAsync(async () => {
        let webhookData = {
            eventName: 'verification_updated',
            details: { age: { data: 25 }, isDocumentExpired: { data: [Object] } },
            identityStatus: 'verified',
            matiDashboardUrl: 'https://dashboard.getmati.com/identities/5fb01f60c326eb001b2bb4de',
            metadata: { id: '5fa9419959141a001789e736' },
            resource: 'https://api.getmati.com/v2/verifications/5fb01f60c326eb001b2bb4e0',
            status: 'reviewNeeded',
            timestamp: '2020-11-14T18:46:55.712Z'
          }
        await kycWebhook(webhookData);
        user = (await getUserAuth({ user: user.id, app: app.id }, user.bearerToken, { id: user.id })).data.message;
        expect(user.kyc_needed).to.equal(false);
    }));
});
