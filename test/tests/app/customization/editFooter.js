import chai from 'chai';
import { mochaAsync, detectValidationErrors } from '../../../utils';
import { editFooterCustomizationApp, getAppAuth } from '../../../methods';
import { get_app } from '../../../models/apps';
const expect = chai.expect;

context('Edit Footer', async () => {
    var app;

    before( async () =>  {
        app = global.test.app;
    });


    it('should be able to edit app footer Links', mochaAsync(async () => {

        const postData = {
            supportLinks : [
                {
                    "name" :    "Affiliate",
                    "href"  :    "https://"
                },
                {
                    "name" :    "Affiliate 2",
                    "href"  :    "https://"
                },
            ],
            communityLinks : [
                {
                    "name" :    "Affiliate",
                    "href"  :    "https://"
                },
                {
                    "name" :    "Affiliate 2",
                    "href"  :    "https://"
                },
            ],
            app : app.id
        };

        let res = await editFooterCustomizationApp(postData, app.bearerToken , {id : app.id});

        expect(detectValidationErrors(res)).to.be.equal(false);

        const { status } = res.data;
        expect(status).to.be.equal(200);
    }));
});
