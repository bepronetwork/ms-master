import {
    modifyBalance,
    getUserAuth
} from '../../../methods';
import { mochaAsync } from '../../../utils';
import chai from 'chai';

const expect = chai.expect;
context('Add Balance Manual', async () => {
    var app, user, admin, wallet, previousBalance = 0;

    before( async () =>  {
        app             = global.test.app;
        user            = global.test.user;
        admin           = global.test.admin;
        user            = (await getUserAuth({user : global.test.user.id, app: app.id}, global.test.user.bearerToken, {id : global.test.user.id})).data.message;
        wallet          = user.wallet[0];
        previousBalance = wallet.playBalance;
        console.log(app);
        console.log(admin);
    });

    it('should add 0.01 in balance of user', mochaAsync(async () => {
        const res = await modifyBalance({user : user.id, app: app.id, admin: admin.id, wallet: wallet._id, newBalance: wallet.playBalance + 0.01}, admin.security.bearerToke, {id : admin.id} );
        let updatedUser = (await getUserAuth({user : global.test.user.id, app: app.id}, global.test.user.bearerToken, {id : global.test.user.id})).data.message;
        expect(res.data.status).to.equal(200);
        expect(updatedUser.wallet[0].playBalance).to.equal(previousBalance+0.01);
    }));
});

