import chai from 'chai';
import { mochaAsync, detectValidationErrors } from '../../../utils';
import { editEsportsScrennerCustomizationApp } from '../../../methods';
const expect = chai.expect;

context('Edit Esports Screnner', async () => {
    var app, admin;

    before( async () =>  {
        app = global.test.app;
        admin = global.test.admin;
    });


    it('should be able to Edit Esports Screnner', mochaAsync(async () => {
        const postData = {
            app : app.id,
            link_url: "hcbhjvfewy",
            button_text: "bd21h32",
            title: "bne2ger3hj",
            subtitle: "12e3gue",
        };

        let res = await editEsportsScrennerCustomizationApp({...postData, admin: admin.id}, admin.security.bearerToken , {id : admin.id});

        expect(detectValidationErrors(res)).to.be.equal(false);

        const { status } = res.data;
        expect(status).to.be.equal(200);

    }));
});
