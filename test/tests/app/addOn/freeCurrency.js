import chai from 'chai';
import { mochaAsync, detectValidationErrors } from '../../../utils';
import {
    addAddonFreeCurrency,
    editFreeCurrency,
    getFreeCurrency,
    registerUser,
    loginUser
} from '../../../methods';
import faker from 'faker';

import Random from '../../../tools/Random';
import models from '../../../models';
import { WalletsRepository } from '../../../../src/db/repos';
const expect = chai.expect;

const genData = (faker, data) => JSON.parse(faker.fake(JSON.stringify(data)));

context('Balance', async () => {
    var app, admin, user, valueBalance = 1;

    before(async () => {
        app = global.test.app;
        admin = global.test.admin;
    });

    it('should add Free Currency', mochaAsync(async () => {
        let res = await addAddonFreeCurrency({ app: app.id, admin: admin.id }, admin.security.bearerToken, { id: admin.id });
        expect(detectValidationErrors(res)).to.be.equal(false);
        const { status } = res.data;
        expect(status).to.be.equal(200);
    }));

    it('should edit Free Currency', mochaAsync(async () => {
        let res = await editFreeCurrency({
            activated: true,
            currency: app.wallet[0].currency._id,
            time: 3600000,
            value: 1,
            app: app.id,
            admin: admin.id
        }, admin.security.bearerToken, { id: admin.id });
        expect(detectValidationErrors(res)).to.be.equal(false);
        const { status } = res.data;
        expect(status).to.be.equal(200);
    }));

    it('should get Free Currency', mochaAsync(async () => {
        let userPostData = genData(faker, models.users.normal_register('687678i678im' + Math.floor(Math.random() * 60) + 18, app.id, {
            username: '678im67im' + Random(10000, 23409234235463456), birthday: "1998-01-02", country: "Brazil", country_acronym: "BR"
        }));
        console.log("userPostData:: ", userPostData)
        const test = await registerUser(userPostData);
        console.log("test:: ", test.data)
        user = (await loginUser(userPostData)).data.message;
        console.log("user:: ", user)

        await WalletsRepository.prototype.updatePlayBalance(app.wallet[0]._id, 1);

        let res = await getFreeCurrency({ currency: app.wallet[0].currency._id, app: app.id, user: user.id }, user.bearerToken, { id: user.id });
        expect(detectValidationErrors(res)).to.be.equal(false);
        const { status } = res.data;
        expect(status).to.be.equal(200);
        let res2 = await getFreeCurrency({ currency: app.wallet[0].currency._id, app: app.id, user: user.id }, user.bearerToken, { id: user.id });
        expect(res2.data.status).to.be.equal(78);
    }));
});
