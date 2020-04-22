import {
    getUserAuth,
    authAdmin,
    getAppAuth,
    pingPost,
    editRestrictedCountries
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
    });

    it('should edit restricted countries to LH(localhost) test', mochaAsync(async () => {
        console.log(app.id);
        const res = await editRestrictedCountries({app: app.id, admin: admin.id, countries: ['LH']}, admin.security.bearerToken, {id : admin.id});
        expect(res.data.status).to.equals(200);
    }));

    it('should try to auth with country not allowed LH(localhost)', mochaAsync(async () => {
        const user = (await getUserAuth({user : ''}, '', {id : ''}));
        expect(user.data.status).to.equals(59);
    }));

    it('should edit restricted countries to ["BR","PT"] test', mochaAsync(async () => {
        const res = await editRestrictedCountries({app: app.id, admin: admin.id, countries: ["BR","PT"]}, admin.security.bearerToken, {id : admin.id});
        expect(res.data.status).to.equals(200);
    }));

});
