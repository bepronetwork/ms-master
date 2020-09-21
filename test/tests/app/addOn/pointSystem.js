import chai from 'chai';
import { mochaAsync, detectValidationErrors } from '../../../utils';
import {
    addAddonPointSystem,
    editAddonPointSystem
} from '../../../methods';
const expect = chai.expect;

context('PointSystem', async () => {
    var app, admin, user, valueBalance = 0.1;

    before(async () => {
        app = global.test.app;
        admin = global.test.admin;
    });

    it('should add Point System', mochaAsync(async () => {
        let res = await addAddonPointSystem({ app: app.id, admin: admin.id }, admin.security.bearerToken, { id: admin.id });
        expect(detectValidationErrors(res)).to.be.equal(false);
        const { status } = res.data;
        expect(status).to.be.equal(200);
    }));

    it(`should edit Point System to eth`, mochaAsync(async () => {
        const res = await editAddonPointSystem({
            app: app.id,
            admin: admin.id,
            currency: app.currencies[0]._id,
            pointSystemParams: {
                isValid: true,
                logo:"",
                name:"",
                ratio:0.1
            }
        }, admin.security.bearerToken , {id : admin.id});
        expect(detectValidationErrors(res)).to.be.equal(false);
        const { status} = res.data;
        expect(status).to.be.equal(200);
    }));
});
