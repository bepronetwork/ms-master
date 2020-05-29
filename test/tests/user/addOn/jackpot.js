import chai from 'chai';
import { mochaAsync } from '../../../utils';
import { getPotJackpot, getAppAuth } from '../../../methods';
const expect = chai.expect;
const ticker = 'ETH';
context('Jackpot', async () => {
    var app, admin, user, currency;

    before( async () =>  {
        app      = global.test.app;
        admin    = global.test.admin;
        user     = global.test.user;
        let appWithWallet = (await getAppAuth({app : app.id, admin: admin.id}, admin.security.bearerToken, {id : admin.id})).data.message;
        currency = (appWithWallet.wallet.find( w => new String(w.currency.ticker).toLowerCase() == new String(ticker).toLowerCase())).currency;
    });

    it('should get pot jackpot', mochaAsync(async () => {
        const res = await getPotJackpot({ currency: currency._id, app: app.id, user: user.id}, user.bearerToken , {id : user.id});
        const { status } = res.data;
        expect(status).to.be.equal(200);
    }));
});