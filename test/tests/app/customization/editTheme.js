import chai from 'chai';
import { mochaAsync, detectValidationErrors } from '../../../utils';
import { editThemeApp } from '../../../methods';
const expect = chai.expect;

context('Edit Theme', async () => {
    var app, admin;

    before(async () => {
        app = global.test.app;
        admin = global.test.admin;
    });


    it('should be able to edit app Theme', mochaAsync(async () => {

        const postData = {
            theme: "light",
            app: app.id
        };

        let res = await editThemeApp({ ...postData, admin: admin.id }, admin.security.bearerToken, { id: admin.id });

        expect(detectValidationErrors(res)).to.be.equal(false);

        const { status } = res.data;
        expect(status).to.be.equal(200);
    }));

    it('shouldnt be able to edit app Theme - Wrong Theme', mochaAsync(async () => {

        const postData = {
            theme: "yellow",
            app: app.id
        };

        let res = await editThemeApp({ ...postData, admin: admin.id }, admin.security.bearerToken, { id: admin.id });

        expect(detectValidationErrors(res)).to.be.equal(false);

        const { status } = res.data;
        expect(status).to.be.equal(61);
    }));
});
