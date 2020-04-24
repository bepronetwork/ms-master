import {
    getUserBetsByPipeline,
    getUserBets
} from '../../methods';

import { mochaAsync } from '../../utils';
import chai from 'chai';
const expect = chai.expect;

context('User Data Filters Bets', async () => {
    var app, user

    before( async () =>  {
        app = global.test.app;
        user = global.test.user;
    });

    it('should Get User Bets', mochaAsync(async () => {
        let res = await getUserBetsByPipeline({user: user.id}, user.bearerToken, {id : user.id});
        expect(res.data.status).to.not.null;
        expect(res.data.status).to.equal(200);
    }));
});

