import chai from 'chai';
import { mochaAsync, detectValidationErrors } from '../../../utils';
import {
    registerUser,
    addAddonBalance,
    editAddonBalance,
    loginUser,
    authUser
} from '../../../methods';
import { get_app } from '../../../models/apps';
import faker from 'faker';
const expect = chai.expect;
import Random from '../../../tools/Random';
import models from '../../../models';

const genData = (faker, data) => JSON.parse(faker.fake(JSON.stringify(data)));

context('Balance', async () => {
    var app, admin, user, valueBalance = 1;

    before(async () => {
        app = global.test.app;
        admin = global.test.admin;
    });

    it('should add Balance', mochaAsync(async () => {
        let res = await addAddonBalance({ app: app.id, admin: admin.id }, admin.security.bearerToken, { id: admin.id });
        expect(detectValidationErrors(res)).to.be.equal(false);
        const { status } = res.data;
        expect(status).to.be.equal(200);
    }));

    it(`should modify balance initial para ${valueBalance} eth`, mochaAsync(async () => {
        const res = await editAddonBalance({
            app         : app.id,
            admin       : admin.id,
            currency    : app.currencies[0]._id,
            balance     : valueBalance
        }, admin.security.bearerToken , {id : admin.id});
        expect(detectValidationErrors(res)).to.be.equal(false);
        const { status} = res.data;
        expect(status).to.be.equal(200);
    }));

    it(`should register the User and checks if the balance initial has changed to ${valueBalance} eth`, mochaAsync(async () => {
        let userPostData = genData(faker, models.users.normal_register('687678i678im' + Math.floor(Math.random() * 60) + 18, app.id, {
            username: '678im67im' + Random(10000, 23409234235463456)
        }));
        var res = await registerUser(userPostData);
        console.log("res.data", res.data)
        user = res.data.message;
        console.log("user", user)
        let balance = user.wallet.find(c => new String(c.currency.ticker).toString().toLowerCase() == 'eth');
        expect(balance.playBalance).to.be.equal(valueBalance);
        expect(res.data.status).to.equal(200);
    }));
});
