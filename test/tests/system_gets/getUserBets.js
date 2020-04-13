import {
    getUserBetsByPipeline
} from '../../methods';

import { mochaAsync } from '../../utils';
import chai from 'chai';
const expect = chai.expect;

context('Get', async () => {
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

    it('should Get User Bets By Currency', mochaAsync(async () => {
        let res = await getUserBetsByPipeline({user: user.id, currency: app.currencies[0]._id}, user.bearerToken, {id : user.id});
        expect(res.data.status).to.not.null;
        expect(res.data.status).to.equal(200);
    }));

    it('should Get User Bets By Bet Id', mochaAsync(async () => {
        let res = await getUserBetsByPipeline({user: user.id, bet: app.users[0].bets[0]}, user.bearerToken, {id : user.id});
        expect(res.data.status).to.not.null;
        expect(res.data.status).to.equal(200);
    }));

    it('should Get User Bets By Game', mochaAsync(async () => {
        let res = await getUserBetsByPipeline({user: user.id, game: app.games[0]._id}, user.bearerToken, {id : user.id});
        expect(res.data.status).to.not.null;
        expect(res.data.status).to.equal(200);
    }));
});

