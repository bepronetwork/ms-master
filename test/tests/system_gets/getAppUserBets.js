import {
    getAppUsersBets
} from '../../methods';
import chai from 'chai';
import { mochaAsync, detectValidationErrors } from '../../utils';

const expect = chai.expect;


context('App Data Filters Bets', async () =>  {
    var admin, app, user;

    before( async () =>  {
        app = global.test.app;
        admin = global.test.admin;
        user = global.test.user
    });

    it('should get All App Users Bets', mochaAsync(async () => {
        let res = await getAppUsersBets({app: app.id, admin: admin.id}, admin.security.bearerToken, {id : admin.id});
        detectValidationErrors(res);
        expect(res.data.status).to.not.null;
        expect(res.data.status).to.equal(200);
    }));
});
