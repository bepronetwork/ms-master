import chai from 'chai';
import { mochaAsync, detectValidationErrors } from '../../../utils';
import { getPotJackpot } from '../../../methods';
const expect = chai.expect;

context('Jackpot', async () => {
    var app, admin, user, currency;

    before( async () =>  {
        app      = global.test.app;
        admin    = global.test.admin;
        user     = global.test.user;
        let appWithWallet = (await getAppAuth({app : admin.app.id, admin: admin.id}, admin.security.bearerToken, {id : admin.id})).data.message;
        currency = (appWithWallet.wallet.find( w => new String(w.currency.ticker).toLowerCase() == new String(ticker).toLowerCase())).currency;
    });

    it('should get pot jackpot', mochaAsync(async () => {
        const res = await getPotJackpot({ currency, app: app.id, user: user.id}, user.bearerToken , {id : user.id});
        console.log(res);
        const { status } = res.data;
        expect(status).to.be.equal(200);
    }));
});
