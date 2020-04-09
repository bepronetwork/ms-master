import chai from 'chai';
import { mochaAsync, detectValidationErrors } from '../../../utils';
import { getAppAuth, addCurrencyWalletToApp, getEcosystemData } from '../../../methods';
import { get_app } from '../../../models/apps';
const expect = chai.expect;

context('Add Virtual Currency', async () => {
    var app, admin;

    before( async () =>  {
        app = global.test.app;
        admin = global.test.admin;
    });

    it('shouldnt be able to add virtual currency to normal app', mochaAsync(async () => {

        /* Get Available Currencies */
        const eco_data = (await getEcosystemData()).data.message;
        const eco_currencies = eco_data.currencies;
        const currency = eco_currencies.find( c => c.virtual);

        const postData = {
            app : app.id,
            passphrase: '',
            currency_id : currency._id
        };

        /* Guarantee Currency Added with Success to Wallet */

        let res = await addCurrencyWalletToApp({...postData, admin: admin.id}, admin.security.bearerToken , {id : admin.id});
        expect(detectValidationErrors(res)).to.be.equal(false);
        const { status } = res.data;
        expect(status).to.be.equal(57);
        
        /* Verify if new wallet has that info */
        let res_app = await getAppAuth({...get_app(app.id), admin: admin.id}, admin.security.bearerToken, {id : admin.id});

        const { wallet } = res_app.data.message;
        expect(wallet.length).to.be.equal(2); // btc + eth
    }));
});
