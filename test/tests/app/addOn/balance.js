import chai from 'chai';
import { mochaAsync, detectValidationErrors } from '../../../utils';
import { addBalance, editBalance } from '../../../methods';
import { get_app } from '../../../models/apps';
const expect = chai.expect;

context('Balance', async () => {
    var app, admin;

    before(async () => {
        app = global.test.app;
        admin = global.test.admin;
    });

    it('should add Balance', mochaAsync(async () => {
        let res = await addBalance({ app: app.id, admin: admin.id }, admin.security.bearerToken, { id: admin.id });
        expect(detectValidationErrors(res)).to.be.equal(false);
        const { status } = res.data;
        expect(status).to.be.equal(200);
    }));

    it('should modify balance initial para 1 eth', mochaAsync(async () => {
        const res = await editBalance({
            app         : app.id,
            admin       : admin.id,
            currency    : app.currencies[0]._id,
            balance     : 1
        }, admin.security.bearerToken , {id : admin.id});
        expect(detectValidationErrors(res)).to.be.equal(false);
        const { status} = res.data;
        expect(status).to.be.equal(200);
    }));

});
