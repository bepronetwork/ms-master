import chai from 'chai';
import { mochaAsync, detectValidationErrors } from '../../../utils';
import { addAutoWithdraw, editAutoWithdraw, editVerifiedKYC, editMaxWithdrawAmountCumulative, editMaxWithdrawAmountPerTransaction } from '../../../methods';
import { get_app } from '../../../models/apps';
const expect = chai.expect;

context('AutoWithdraw', async () => {
    var app, admin;

    before( async () =>  {
        app = global.test.app;
        admin = global.test.admin;
    });

    it('should add Automatic Withdraw', mochaAsync(async () => {
        let res = await addAutoWithdraw({app: app.id, admin: admin.id}, admin.security.bearerToken , {id : admin.id});
        expect(detectValidationErrors(res)).to.be.equal(false);
        const { status } = res.data;
        expect(status).to.be.equal(200);
    }));

    it('should Edit if is Automatic Withdraw', mochaAsync(async () => {
        let res = await editAutoWithdraw({
            app: app.id, 
            admin: admin.id,
            isAutoWithdraw: true
        }, admin.security.bearerToken , {id : admin.id});
        expect(detectValidationErrors(res)).to.be.equal(false);
        const { status } = res.data;
        expect(status).to.be.equal(200);
    }));

    it('should Edit Max Withdraw Amount Cumulative', mochaAsync(async () => {
        let res = await editMaxWithdrawAmountCumulative({
            app: app.id, 
            admin: admin.id,
            currency: app.currencies[0]._id,
            amount : 1
        }, admin.security.bearerToken , {id : admin.id});
        expect(detectValidationErrors(res)).to.be.equal(false);
        const { status } = res.data;
        expect(status).to.be.equal(200);
    }));

    it('should Edit Max Withdraw Amount Per Transaction', mochaAsync(async () => {
        let res = await editMaxWithdrawAmountPerTransaction({
            app: app.id, 
            admin: admin.id,
            currency: app.currencies[0]._id,
            amount : 1
        }, admin.security.bearerToken , {id : admin.id});
        expect(detectValidationErrors(res)).to.be.equal(false);
        const { status } = res.data;
        expect(status).to.be.equal(200);
    }));

    it('should Edit Verified KYC', mochaAsync(async () => {
        let res = await editVerifiedKYC({
            app: app.id, 
            admin: admin.id,
            verifiedKYC: true
        }, admin.security.bearerToken , {id : admin.id});
        expect(detectValidationErrors(res)).to.be.equal(false);
        const { status } = res.data;
        expect(status).to.be.equal(200);
    }));
});
