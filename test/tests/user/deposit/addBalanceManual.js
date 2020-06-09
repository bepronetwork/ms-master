import {
    modifyBalance,
    getUserAuth
} from '../../../methods';
import { mochaAsync } from '../../../utils';
import chai from 'chai';

const expect = chai.expect;
context('Add Balance Manual', async () => {
    var app, user, admin, wallet;

    before( async () =>  {
        app = global.test.app;
        user = global.test.user;
        admin = global.test.admin;
        user = (await getUserAuth({user : global.test.user.id, app: app.id}, global.test.user.bearerToken, {id : global.test.user.id})).data.message;
        console.log(user);
        console.log(user.wallet);
        wallet = user.wallet[0];
    });

    it('should add 0.01 in balance of user', mochaAsync(async () => {
        const res = await modifyBalance({user : user.id, app: app.id, admin: admin.id, wallet: wallet._id, newBalance: wallet.playBalance + 0.01}, admin.security.bearerToke, {id : admin.id} );
        console.log(res);
        user = (await getUserAuth({user : global.test.user.id, app: app.id}, global.test.user.bearerToken, {id : global.test.user.id})).data.message;
        console.log(user.wallet);
        expect(res.data.status).to.equal(200);
    }));
});

