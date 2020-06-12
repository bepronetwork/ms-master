import chai from 'chai';
import { mochaAsync, detectValidationErrors } from '../../../utils';
import { getAppAuth, addCurrencyWalletToApp, getEcosystemData, generateAddresses } from '../../../methods';
import { get_app } from '../../../models/apps';
import delay from 'delay';
const expect = chai.expect;

context('Generate ETH Addresses', async () => {
    var app, admin, TokenTicker = 'eth';

    before( async () =>  {
        app = global.test.app;
        admin = global.test.admin;
    });

    it('should be able create 10 new Addresses for App', mochaAsync(async () => {

        /* Get Available Currencies */
        const eco_data = (await getEcosystemData()).data.message;
        const eco_currencies = eco_data.currencies;
        const currency = eco_currencies.find( c => new String(c.ticker).toLowerCase() == 'eth')

        const postData = {
            app : app.id,
            amount : 10,
            currency : currency._id,
            admin : admin.id
        };
        await delay(60*1000); // 100 secs
        /* Guarantee Currency Added with Success to Wallet */
        let res = await generateAddresses(postData, admin.security.bearerToken , {id : admin.id});
        console.log(res)
        expect(detectValidationErrors(res)).to.be.equal(false);
        const { status } = res.data;
        expect(status).to.be.equal(200);
        let res_app = await getAppAuth({...get_app(app.id), admin: admin.id}, admin.security.bearerToken, {id : admin.id});
        console.log("wallet", res_app.data.message.wallet)
        console.log("\n new \n")
        /* Verify if new wallet has that info */
        await delay(60*1000); // 100 secs
        /* Guarantee Currency Added with Success to Wallet */
        res = await generateAddresses(postData, admin.security.bearerToken , {id : admin.id});
        console.log(res)
        expect(detectValidationErrors(res)).to.be.equal(false);
        expect(res.data.status).to.be.equal(200);
        res_app = await getAppAuth({...get_app(app.id), admin: admin.id}, admin.security.bearerToken, {id : admin.id});
        global.test.app = res_app.data.message;
        const { wallet } = res_app.data.message;
        console.log("wallet", wallet)
    }));

    it('shouldn´t create another 10 new Addresses for App - but instead only show the info and confirm the current created (10)', mochaAsync(async () => {

    }));

    it('should be able create 5 more new Addresses for App', mochaAsync(async () => {

    }));

    it('shouldn´t create another 5 new Addresses for App - but instead only show the info and confirm the current created (15)', mochaAsync(async () => {

    }));

});
