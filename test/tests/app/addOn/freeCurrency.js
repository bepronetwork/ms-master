import chai from 'chai';
import { mochaAsync, detectValidationErrors } from '../../../utils';
import {
    addAddonFreeCurrency
} from '../../../methods';
import faker from 'faker';

const expect = chai.expect;

const genData = (faker, data) => JSON.parse(faker.fake(JSON.stringify(data)));

context('Balance', async () => {
    var app, admin, user, valueBalance = 1;

    before(async () => {
        app = global.test.app;
        admin = global.test.admin;
    });

    it('should add Fee Currency', mochaAsync(async () => {
        let res = await addAddonFreeCurrency({ app: app.id, admin: admin.id }, admin.security.bearerToken, { id: admin.id });
        expect(detectValidationErrors(res)).to.be.equal(false);
        const { status } = res.data;
        expect(status).to.be.equal(200);
    }));
});
