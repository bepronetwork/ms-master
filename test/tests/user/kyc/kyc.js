import {
    editKycNeeded,
    getUserAuth,
    kycWebhook,
    loginUser,
    getAppAuth,
    authAdmin
} from '../../../methods';
import chai from 'chai';
import { mochaAsync } from '../../../utils';

const expect = chai.expect;

context('Kyc', async () =>  {
    var app, admin, user;


    before( async () =>  {
        admin   = (await authAdmin({ admin : "5f5295cc1534320027631b94" }, "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IkF1dGgvNWY1Mjk1Y2MxNTM0MzIwMDI3NjMxYjk0IiwidGltZSI6MTYwNDY4MzYwODUyMCwiaWF0IjoxNjAyMDkxNjA4fQ.DHHEWv4bvlWiA8sQpQKLuL-nqMK_de-Qn7oYe2SQGq-iZhaR4d69z84SAOj9MhK5zjaBiH6NxD7TQsHQA_ObGA", { id : "5f5295cc1534320027631b94"})).data.message;
        console.log(admin);
        app     = (await getAppAuth({app : "5f5295d31534320027631bb4", admin: admin.id}, admin.security.bearerToken, {id : admin.id})).data.message;
        user    = (await loginUser({username:"sivapof211@x1post.com", password: "sivapof211@x1post.com", app: "5f5295d31534320027631bb4"})).data.message;
        user    = (await getUserAuth({ user: user.id, app: app.id }, user.bearerToken, { id: user.id })).data.message;
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
            details: { age: { data: 25 }, isDocumentExpired: { data: [] } },
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
