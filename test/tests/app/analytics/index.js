import chai from 'chai';
import { mochaAsync, detectValidationErrors } from '../../../utils';
import { editAnalyticsKey } from '../../../methods';
const expect = chai.expect;

context('Edit Analytics', async () => {
    var app, admin;

    before( async () =>  {
        app = global.test.app;
        admin = global.test.admin;
    });


    it('should be able to edit app Analytics', mochaAsync(async () => {

        const postData = {
            analytics_id : app.analytics._id,
            app : app.id,
            google_tracking_id: "teste123"
        };

        let res = await editAnalyticsKey({...postData, admin: admin.id}, admin.security.bearerToken , {id : admin.id});

        expect(detectValidationErrors(res)).to.be.equal(false);

        const { status } = res.data;
        expect(status).to.be.equal(200);
    }));
});
