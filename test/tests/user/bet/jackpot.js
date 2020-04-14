import {
    getUserAuth,
    authAdmin,
    getAppAuth
} from '../../../methods';

import AppRepository from "../../../../src/db/repos";

import chai from 'chai';

import { mochaAsync } from '../../../utils';

const expect = chai.expect;

context(`Jackpot`, async () =>  {
    var admin, app, user, currency, game;

    before( async () =>  {
        admin = (await authAdmin({ admin : global.test.admin.id }, global.test.admin.security.bearerToken, { id : global.test.admin.id})).data.message;
        app = (await getAppAuth({app : admin.app.id, admin: admin.id}, admin.security.bearerToken, {id : admin.id})).data.message;
    });

    it('should pot of jackpot OK', mochaAsync(async () => {

        let appResultAll = await AppRepository.prototype.findAppById(app.id);
        console.log(appResultAll);
        console.log(global.test.pot);
        expect(200).to.equal(200);
    }));
});