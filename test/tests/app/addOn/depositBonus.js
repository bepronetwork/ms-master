import chai from 'chai';
import { mochaAsync, detectValidationErrors } from '../../../utils';
import { addAddonDepositBonus, editAddonDepositBonus } from '../../../methods';
const expect = chai.expect;

context('Deposit Bonus', async () => {
    var app, admin;

    before(async () => {
        app = global.test.app;
        admin = global.test.admin;
    });

    it('should add Deposit Bonus', mochaAsync(async () => {
        let res = await addAddonDepositBonus({ app: app.id, admin: admin.id }, admin.security.bearerToken, { id: admin.id });
        expect(detectValidationErrors(res)).to.be.equal(false);
        const { status } = res.data;
        expect(status).to.be.equal(200);
    }));

    it('should Edit Deposit Bonus', mochaAsync(async () => {
        let res = await editAddonDepositBonus({
            app: app.id,
            admin: admin.id,
            currency: app.currencies[0]._id,
            depositBonusParams: {
                isDepositBonus: true,
                min_deposit: 0.001,
                percentage: 10,
                max_deposit: 10
            }
        }, admin.security.bearerToken, { id: admin.id });
        expect(detectValidationErrors(res)).to.be.equal(false);
        const { status } = res.data;
        expect(status).to.be.equal(200);
    }));
});
