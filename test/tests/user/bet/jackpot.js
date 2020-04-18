import {
    getUserAuth,
    authAdmin,
    getAppAuth
} from '../../../methods';
import {AppRepository} from "../../../../src/db/repos";
import chai from 'chai';
import { mochaAsync } from '../../../utils';
import delay from 'delay';

const expect = chai.expect;

context(`Jackpot`, async () =>  {
    var admin, app;

    before( async () =>  {
        admin = (await authAdmin({ admin : global.test.admin.id }, global.test.admin.security.bearerToken, { id : global.test.admin.id})).data.message;
        app = (await getAppAuth({app : admin.app.id, admin: admin.id}, admin.security.bearerToken, {id : admin.id})).data.message;
    });

    it('should pot of jackpot OK', mochaAsync(async () => {
        console.log("Waiting for 30 seconds for pot accumulate...");
        await delay(30000);
        let appResultAll = await AppRepository.prototype.findAppById(app.id);
        // TODO change to all currencies. ([0] is ETH)
        expect(global.test.pot).to.equal(appResultAll.addOn.jackpot.limits[0].pot);
    }));
});