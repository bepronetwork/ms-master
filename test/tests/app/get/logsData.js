import {
    getUserAuth,
    authAdmin,
    getAppAuth,
    pingPost,
    getLogs
} from '../../../methods';

import chai from 'chai';

import { mochaAsync } from '../../../utils';

const expect = chai.expect;

context(`Logs Data`, async () =>  {
    var admin, app, user, game;

    before( async () =>  {
        admin = (await authAdmin({ admin : global.test.admin.id }, global.test.admin.security.bearerToken, { id : global.test.admin.id})).data.message;
        app = (await getAppAuth({app : admin.app.id, admin: admin.id}, admin.security.bearerToken, {id : admin.id})).data.message;
        game = app.games.find( game => game.metaName == metaName);
        // currency = (app.wallet.find( w => new String(w.currency.ticker).toLowerCase() == new String(currencyTicker).toLowerCase())).currency;
        user = (await getUserAuth({user : global.test.user.id}, global.test.user.bearerToken, {id : global.test.user.id})).data.message;
    });

    it('should get Log - admin', mochaAsync(async () => {
        var res = await getLogs({type: "admin", app: app.id}, {offset:0,limit:10,filter:'ADMIN'}, admin.bearerToken, {id : admin.id});
        console.log(res.data.message);
        expect(res.data.message.list.length).to.not.equals(0);
        expect(res.data.status).to.equals(200);
    }));

    it('should get Log - user', mochaAsync(async () => {
        var res = await getLogs({type: "admin", app: app.id}, {offset:0,limit:10,filter:'USER'}, admin.bearerToken, {id : admin.id});
        expect(res.data.message.list.length).to.not.equals(0);
        expect(res.data.status).to.equals(200);
    }));

    it('should get Log - Restricted Countries', mochaAsync(async () => {
        var res = await getLogs({type: "admin", app: app.id}, {offset:0,limit:10,filter:'UNAUTHORIZED_COUNTRY'}, admin.bearerToken, {id : admin.id});
        expect(res.data.message.list.length).to.not.equals(0);
        expect(res.data.status).to.equals(200);
    }));
});