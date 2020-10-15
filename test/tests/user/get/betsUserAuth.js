import {
    getUserBetsByPipeline,
    getDeposit
} from '../../../methods';

import { mochaAsync } from '../../../utils';
import chai from 'chai';
const expect = chai.expect;

context('Get', async () => {
    var app, user, admin

    before( async () =>  {
        admin = global.test.admin;
        app = global.test.app;
        user = global.test.user;
    });

    it('should Get User Bets', mochaAsync(async () => {
        let res = await getUserBetsByPipeline({user: user.id, currency: app.currencies[0]._id}, user.bearerToken, {id : user.id});
        expect(res.data.status).to.not.null;
        expect(res.data.status).to.equal(200);
    }));

    it('should Get Users Deposits By App Id', mochaAsync(async () => {
        let res = await getDeposit({ app: app.id, admin: admin.id }, admin.security.bearerToken, { id: admin.id });
        expect(res.data.status).to.not.null;
        expect(res.data.status).to.equal(200);
    }));

    it('should Get Users Deposits By User Id', mochaAsync(async () => {
        let res = await getDeposit({ app: app.id, admin: admin.id, user: user.id }, admin.security.bearerToken, { id: admin.id });
        expect(res.data.status).to.not.null;
        expect(res.data.status).to.equal(200);
    }));
});

