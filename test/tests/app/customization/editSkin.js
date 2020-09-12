import chai from 'chai';
import { mochaAsync, detectValidationErrors } from '../../../utils';
import { editSkin } from '../../../methods';
import { AppRepository } from '../../../../src/db/repos';
const expect = chai.expect;

context('Edit Theme', async () => {
    var app, admin;

    before(async () => {
        app = global.test.app;
        admin = global.test.admin;
        app = await AppRepository.prototype.findAppById(app.id, 'simple')
    });

    it('should be able to edit app Skin', mochaAsync(async () => {

        const postData = {
            skinParams: {
                _id: app.customization.skin._id,
                skin_type: "digital",
                name: "Digital"
                },
            app: app._id
        };

        let res = await editSkin({ ...postData, admin: admin.id }, admin.security.bearerToken, { id: admin.id });

        expect(detectValidationErrors(res)).to.be.equal(false);

        const { status } = res.data;
        expect(status).to.be.equal(200);
    }));
});
