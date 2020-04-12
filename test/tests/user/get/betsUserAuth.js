import {
    getUserBetsByPipeline
} from '../../../methods';

import { mochaAsync } from '../../../utils';
import chai from 'chai';
const expect = chai.expect;

context('Get', async () => {
    var app, user

    before( async () =>  {
        app = global.test.app;
        user = global.test.user;
    });

    it('should Get User Bets', mochaAsync(async () => {
        console.log(user.id);
        console.log(user.bearerToken);
        console.log(app.currencies[0]._id)
        let res = await getUserBetsByPipeline({user: user.id, currency: app.currencies[0]._id}, user.bearerToken, {id : user.id});
        console.log(res.data)
        expect(res.data.status).to.not.null;
        expect(res.data.status).to.equal(200);
    }));
});

