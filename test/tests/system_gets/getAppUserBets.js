import {
    getAppUsersBets
} from '../../methods';
import chai from 'chai';
import { mochaAsync, detectValidationErrors } from '../../utils';

const expect = chai.expect;


context('App Data Filters Bets', async () =>  {
    var admin, app, user;


    before( async () =>  {
        app = global.test.app;
        admin = global.test.admin;
        user = global.test.user
    });

    it('should get All App Users Bets', mochaAsync(async () => {
        let res = await getAppUsersBets({app: app.id, admin: admin.id}, admin.security.bearerToken, {id : admin.id});
        detectValidationErrors(res);
        expect(res.data.status).to.not.null;
        expect(res.data.status).to.equal(200);
    }));
    
    it('should get All App Users Bets By Currency', mochaAsync(async () => {
        let res = await getAppUsersBets({app: app.id, admin: admin.id, currency: app.currencies[0]._id}, admin.security.bearerToken, {id : admin.id});
        detectValidationErrors(res);
        expect(res.data.status).to.not.null;
        expect(res.data.status).to.equal(200);
    })); 

    it('should get All App Users Bets By User', mochaAsync(async () => {
        let res = await getAppUsersBets({app: app.id, admin: admin.id, user: app.users[0]._id}, admin.security.bearerToken, {id : admin.id});
        console.log(res.data)
        detectValidationErrors(res);
        expect(res.data.status).to.not.null;
        expect(res.data.status).to.equal(200);
    }));

    it('should get All App Users Bets By Game', mochaAsync(async () => {
        let res = await getAppUsersBets({app: app.id, admin: admin.id, game: app.games[0]._id}, admin.security.bearerToken, {id : admin.id});
        console.log(res.data)
        detectValidationErrors(res);
        expect(res.data.status).to.not.null;
        expect(res.data.status).to.equal(200);
    }));

    it('should get All App Users Bets By Bet Id', mochaAsync(async () => {
        let res = await getAppUsersBets({app: app.id, admin: admin.id, bet: app.users[0].bets[0]._id}, admin.security.bearerToken, {id : admin.id});
        console.log(res.data)
        detectValidationErrors(res);
        expect(res.data.status).to.not.null;
        expect(res.data.status).to.equal(200);
    }));

});
