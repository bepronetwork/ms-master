import chai from 'chai';
import { mochaAsync, detectValidationErrors } from '../../../utils';
import { editColorsCustomizationApp, getAppAuth } from '../../../methods';
import { get_app } from '../../../models/apps';
const expect = chai.expect;

context('Edit Colors', async () => {
    var app;

    before( async () =>  {
        app = global.test.app;
    });


    it('should be able to edit app colors', mochaAsync(async () => {

        const postData = {
            colors : [
                {
                    "type" :    "backgroundColor",
                    "hex"  :    "#ffffff"
                },
                {
                    "type" :    "primaryColor",
                    "hex"  :    "#cccccc"
                },
                {
                    "type" :    "secondaryColor",
                    "hex"  :    "#eeeeeee"
                },
                {
                    "type" :    "thirdColor",
                    "hex"  :    "#ffffff"
                },
                {
                    "type" :    "forthColor",
                    "hex"  :    "#ffffff"
                },
                {
                    "type" :    "fifthColor",
                    "hex"  :    "#ffffff"
                },
                {
                    "type" :    "sixthColor",
                    "hex"  :    "#ffffff"
                },
                {
                    "type" :    "seventhColor",
                    "hex"  :    "#ffffff"
                },
                {
                    "type" :    "heightColor",
                    "hex"  :    "#ffffff"
                }
            ],
            app : app.id
        };

        let res = await editColorsCustomizationApp(postData, app.bearerToken , {id : app.id});

        expect(detectValidationErrors(res)).to.be.equal(false);

        const { status } = res.data;
        expect(status).to.be.equal(200);
    }));
});
