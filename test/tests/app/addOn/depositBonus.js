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

    it('shouldnt add Deposit Bonus - BearerToken Null', mochaAsync(async () => {
        let res = await addAddonDepositBonus({ app: app.id, admin: admin.id }, null, { id: admin.id });
        expect(detectValidationErrors(res)).to.be.equal(false);
        const { status } = res.data;
        expect(status).to.be.equal(304);
    }));

    it('shouldnt add Deposit Bonus - Wrong BearerToken', mochaAsync(async () => {
        let res = await addAddonDepositBonus({ app: app.id, admin: admin.id }, "jwxdbhcbh3b2b1wjsxwjkb1b2sxbwjk1231edxbjwjqj3", { id: admin.id });
        expect(detectValidationErrors(res)).to.be.equal(false);
        const { status } = res.data;
        expect(status).to.be.equal(304);
    }));

    it('shouldnt add Deposit Bonus - Invalid Admin_Id', mochaAsync(async () => {
        let res = await addAddonDepositBonus({ app: app.id, admin: admin.id }, admin.security.bearerToken, { id: "32j322jc21n31j432" });
        expect(detectValidationErrors(res)).to.be.equal(false);
        const { status } = res.data;
        expect(status).to.be.equal(304);
    }));

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
                max_deposit: 10,
                multiplier: 10
            }
        }, admin.security.bearerToken, { id: admin.id });
        expect(detectValidationErrors(res)).to.be.equal(false);
        const { status } = res.data;
        expect(status).to.be.equal(200);
    }));

    it('shouldnt Edit Deposit Bonus - Invalid Percentage Value', mochaAsync(async () => {
        let res = await editAddonDepositBonus({
            app: app.id,
            admin: admin.id,
            currency: app.currencies[0]._id,
            depositBonusParams: {
                isDepositBonus: true,
                min_deposit: 0.001,
                percentage: 0,
                max_deposit: 10,
                multiplier: 10
            }
        }, admin.security.bearerToken, { id: admin.id });
        expect(detectValidationErrors(res)).to.be.equal(false);
        const { status } = res.data;
        expect(status).to.be.equal(64);
    }));

    it('shouldnt Edit Deposit Bonus - Max_Deposit < Min_Deposit', mochaAsync(async () => {
        let res = await editAddonDepositBonus({
            app: app.id,
            admin: admin.id,
            currency: app.currencies[0]._id,
            depositBonusParams: {
                isDepositBonus: true,
                min_deposit: 1,
                percentage: 10,
                max_deposit: 0.5,
                multiplier: 10
            }
        }, admin.security.bearerToken, { id: admin.id });
        expect(detectValidationErrors(res)).to.be.equal(false);
        const { status } = res.data;
        expect(status).to.be.equal(65);
    }));

    it('shouldnt Edit Deposit Bonus - Invalid Min_Deposit Value', mochaAsync(async () => {
        let res = await editAddonDepositBonus({
            app: app.id,
            admin: admin.id,
            currency: app.currencies[0]._id,
            depositBonusParams: {
                isDepositBonus: true,
                min_deposit: 0,
                percentage: 10,
                max_deposit: 10,
                multiplier: 10
            }
        }, admin.security.bearerToken, { id: admin.id });
        expect(detectValidationErrors(res)).to.be.equal(false);
        const { status } = res.data;
        expect(status).to.be.equal(66);
    }));

    it('shouldnt Edit Deposit Bonus - Invalid Admin_Id', mochaAsync(async () => {
        let res = await editAddonDepositBonus({
            app: app.id,
            admin: admin.id,
            currency: app.currencies[0]._id,
            depositBonusParams: {
                isDepositBonus: true,
                min_deposit: 0.001,
                percentage: 10,
                max_deposit: 10,
                multiplier: 10
            }
        }, admin.security.bearerToken, { id: "31093xjewbh11" });
        expect(detectValidationErrors(res)).to.be.equal(false);
        const { status } = res.data;
        expect(status).to.be.equal(304);
    }));

    it('shouldnt Edit Deposit Bonus - Wrong BearerToken', mochaAsync(async () => {
        let res = await editAddonDepositBonus({
            app: app.id,
            admin: admin.id,
            currency: app.currencies[0]._id,
            depositBonusParams: {
                isDepositBonus: true,
                min_deposit: 0.001,
                percentage: 10,
                max_deposit: 10,
                multiplier: 10
            }
        }, "194832rfdhcedvcgvaswhjqbwv23tehju12wsgwebhcdshy2gsbysndjkbcyeubywusab2", { id: admin.id });
        expect(detectValidationErrors(res)).to.be.equal(false);
        const { status } = res.data;
        expect(status).to.be.equal(304);
    }));
});
