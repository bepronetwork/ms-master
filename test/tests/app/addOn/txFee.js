import chai from 'chai';
import { mochaAsync, detectValidationErrors } from '../../../utils';
import { addAddonTxFee, editAddonTxFee } from '../../../methods';
import { get_app } from '../../../models/apps';
const expect = chai.expect;

context('Tx Fee', async () => {
    var app, admin;

    before(async () => {
        app = global.test.app;
        admin = global.test.admin;
    });

    it('should add Tx Fee', mochaAsync(async () => {
        let res = await addAddonTxFee({ app: app.id, admin: admin.id }, admin.security.bearerToken, { id: admin.id });
        expect(detectValidationErrors(res)).to.be.equal(false);
        const { status } = res.data;
        expect(status).to.be.equal(200);
    }));

    it('should Edit Tx Fee', mochaAsync(async () => {
        let res = await editAddonTxFee({
            app: app.id,
            admin: admin.id,
            currency: app.currencies[0]._id,
            txFeeParams: {
                isTxFee: true,
                deposit_fee: 0.001,
                withdraw_fee: 0.001
            }
        }, admin.security.bearerToken, { id: admin.id });
        expect(detectValidationErrors(res)).to.be.equal(false);
        const { status } = res.data;
        expect(status).to.be.equal(200);
    }));
});
