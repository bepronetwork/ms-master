import {
    editKycNeeded,
    getUserAuth
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
});
