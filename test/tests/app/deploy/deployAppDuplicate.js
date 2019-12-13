import chai from 'chai';
import { mochaAsync, detectValidationErrors } from '../../../utils';
import { getAppAuth, deployApp } from '../../../methods';
import { get_app } from '../../../models/apps';
import { HerokuClientSingleton } from '../../../../src/logic/third-parties';
const expect = chai.expect;

context('Deploy App Duplicate', async () => {
    var app;

    before( async () =>  {
        app = global.test.app;
    });


    it('should not be able to deploy the App Again, already existent', mochaAsync(async () => {

        const postData = {
            app : app.id,
        };

        let res = await deployApp(postData, app.bearerToken , {id : app.id});

        expect(detectValidationErrors(res)).to.be.equal(false);

        let res_app = await getAppAuth(get_app(app.id), app.bearerToken, {id : app.id});

        const { status } = res.data;
        expect(status).to.be.equal(44);

        const { web_url, hosting_id } = res_app.data.message;
        expect(hosting_id).to.not.be.null;
        expect(web_url).to.not.be.null;
    }));
});
