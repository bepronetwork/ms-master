import {
    convertPoints
} from '../../../methods';
import { detectValidationErrors, mochaAsync } from '../../../utils';
import chai from 'chai';

const expect = chai.expect;

context('Points', async () => {
    var app, admin, currency;


    before( async () =>  {
        admin = global.test.admin;
        app = global.test.app;
        currency = app.currencies[0]
    });

    it('should Convert Points To Currency', mochaAsync(async () => {
        const postData = {
            app: app.id,
            currency,
            user: "all",
            isAbsolut: true
        };
        let res = await convertPoints({...postData, admin: admin.id}, admin.security.bearerToken , {id : admin.id});
        console.log("res:: ",res.data)
        expect(res.data.status).to.equal(200);
    }));
});

