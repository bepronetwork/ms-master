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
        admin   = (await authAdmin({ admin : global.test.admin.id }, global.test.admin.security.bearerToken, { id : global.test.admin.id})).data.message;
        app     = (await getAppAuth({app : admin.app.id, admin: admin.id}, admin.security.bearerToken, {id : admin.id})).data.message;
    });

    it('should get Log - admin', mochaAsync(async () => {
        var res = await getLogs({app: app.id, admin: admin.id, offset:0,limit:10,filter:'ADMIN'}, admin.security.bearerToken, {id : admin.id});
        expect(res.data.status).to.equals(200);
    }));

    it('should get Log - user', mochaAsync(async () => {
        var res = await getLogs({app: app.id, admin: admin.id, offset:0,limit:10,filter:'USER'}, admin.security.bearerToken, {id : admin.id});
        expect(res.data.status).to.equals(200);
    }));

    it('should get Log - Restricted Countries', mochaAsync(async () => {
        var res = await getLogs({app: app.id, admin: admin.id, offset:0,limit:10,filter:'UNAUTHORIZED_COUNTRY'}, admin.security.bearerToken, {id : admin.id});
        expect(res.data.status).to.equals(200);
    }));
});