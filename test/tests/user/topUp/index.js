import {
    addTopUp,
    getUserAuth
} from '../../../methods';
import chai from 'chai';
import { mochaAsync } from '../../../utils';

const expect = chai.expect;

context('Top Up', async () =>  {
    var app, admin, user;


    before( async () =>  {
        app     = global.test.app;
        user    = global.test.user;
        user    = (await getUserAuth({ user: user.id, app: app.id }, user.bearerToken, { id: user.id })).data.message;
        admin   = global.test.admin;
    });

    it('should Register Top Up Reason', mochaAsync(async () => {
        let postData = {
            admin      : admin.id,
            user       : user.id,
            reason     : "Test",
            amount     : 0.1,
            wallet     : user.wallet[0]._id,
            currency   : user.wallet[0].currency._id
        }
        let res = await addTopUp(postData , admin.security.bearerToken , {id : admin.id})
        expect(res.data.status).to.equal(200);
    }));
});
