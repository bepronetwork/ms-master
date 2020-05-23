import {
    resetAdminPassword,
    setAdminPassword
} from '../../../methods';

import { mochaAsync } from '../../../utils';
import chai from 'chai';

const expect = chai.expect;

context('Reset Admin Password', async () => {
    var admin;

    before( async () =>  {
        admin = global.test.admin;
    });

    it('should Reset Password With Username', mochaAsync(async () => {
        const res = await resetAdminPassword({username_or_email : admin.username});
        expect(res.data.status).to.not.null;
        expect(res.data.status).to.equal(200);
    }));

    it('should Reset Password With Email', mochaAsync(async () => {
        const res = await resetAdminPassword({username_or_email : admin.email});
        expect(res.data.status).to.not.null;
        expect(res.data.status).to.equal(200);
    }));

    it('should Reset Password With Username Invalid', mochaAsync(async () => {
        const res = await resetAdminPassword({username_or_email : admin.username + "1"});
        expect(res.data.status).to.not.null;
        expect(res.data.status).to.equal(55);
    }));

    it('should Reset Password With Email Invalid', mochaAsync(async () => {
        const res = await resetAdminPassword({username_or_email : admin.email + "1"});
        expect(res.data.status).to.not.null;
        expect(res.data.status).to.equal(55);
    }));
    it('should Set Password With Token Invalid', mochaAsync(async () => {
        const res = await setAdminPassword({
            admin_id : admin._id,
            token   : "asdasdasdasdasdasd",
            password: "123123"
        });
        expect(res.data.status).to.not.null;
        expect(res.data.status).to.equal(49);
    }));
    it('should Set Password With Token Expired', mochaAsync(async () => {
        const res = await setAdminPassword({
            admin_id : admin._id,
            token   : "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aW1lIjoxNTgwOTUyMjgwODg3LCJpYXQiOjE1ODA5NTEwMzd9.qovq5qXqzWdlSSvkx5XSTpYU5BSfaAMWvQWf1pLadcfPySw2Q0lk5WAuHoIVQlCYvXioKM86gnIpQQLKw_zAiA",
            password: "123123"
        });
        expect(res.data.status).to.not.null;
        expect(res.data.status).to.equal(48);
    }));


});

