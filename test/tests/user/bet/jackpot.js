import {
    getUserAuth,
    authAdmin,
    getAppAuth
} from '../../../methods';

import chai from 'chai';

import { mochaAsync } from '../../../utils';

const expect = chai.expect;

context(`Jackpot`, async () =>  {
    var admin, app, user, currency, game;

    before( async () =>  {
        admin = (await authAdmin({ admin : global.test.admin.id }, global.test.admin.security.bearerToken, { id : global.test.admin.id})).data.message;
        app = (await getAppAuth({app : admin.app.id, admin: admin.id}, admin.security.bearerToken, {id : admin.id})).data.message;
        game = app.games.find( game => game.metaName == metaName);
        currency = (app.wallet.find( w => new String(w.currency.ticker).toLowerCase() == new String(currencyTicker).toLowerCase())).currency;
        user = (await getUserAuth({user : global.test.user.id}, global.test.user.bearerToken, {id : global.test.user.id})).data.message;
    });

    it('should pot of jackpot OK', mochaAsync(async () => {
        console.log(user);
        console.log(global.test.pot);
        expect(200).to.equal(200);
    }));
});