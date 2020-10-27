import {
    getUserAuth,
    authAdmin,
    getAppAuth,
    pingPost,
    editRestrictedCountries,
    registerUser
} from '../../../methods';
import faker from 'faker';

import chai from 'chai';

import { mochaAsync } from '../../../utils';
import Random from '../../../tools/Random';
const expect = chai.expect;

import models from '../../../models';
const genData = (faker, data) => JSON.parse(faker.fake(JSON.stringify(data)));

context(`Logs Data`, async () =>  {
    var admin, app, user, game;

    before( async () =>  {
        admin = (await authAdmin({ admin : global.test.admin.id }, global.test.admin.security.bearerToken, { id : global.test.admin.id})).data.message;
        app = (await getAppAuth({app : admin.app.id, admin: admin.id}, admin.security.bearerToken, {id : admin.id})).data.message;
        game = app.games.find( game => game.metaName == metaName);
        // currency = (app.wallet.find( w => new String(w.currency.ticker).toLowerCase() == new String(currencyTicker).toLowerCase())).currency;
    });

    it('should edit restricted countries to LH(localhost) test', mochaAsync(async () => {
        const res = await editRestrictedCountries({app: app.id, admin: admin.id, countries: ['LH']}, admin.security.bearerToken, {id : admin.id});
        expect(res.data.status).to.equals(200);
    }));

    it('should try to register user with country not allowed LH(localhost)', mochaAsync(async () => {
        console.log(1111);
        let userPostData = genData(faker, models.users.normal_register('687678i678im' + Math.floor(Math.random() * 60) + 18, app.id, {
            username: '678im67im' + Random(10000, 23409234235463456)
        }));
        console.log(userPostData);
        var res = await registerUser(userPostData);
        expect(res.data.status).to.equals(59);
    }));

    it('should edit restricted countries to ["BR","PT"] test', mochaAsync(async () => {
        const res = await editRestrictedCountries({app: app.id, admin: admin.id, countries: ["BR","PT"]}, admin.security.bearerToken, {id : admin.id});
        expect(res.data.status).to.equals(200);
    }));

});
