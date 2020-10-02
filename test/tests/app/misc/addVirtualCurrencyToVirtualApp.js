import chai from 'chai';
import { mochaAsync, detectValidationErrors } from '../../../utils';
import { getAppAuth, addCurrencyWalletToApp, getEcosystemData } from '../../../methods';
import { get_app } from '../../../models/apps';
import { PRICE_VIRTUAL_CURRENCY_GLOBAL } from '../../../../src/config';
const expect = chai.expect;

context('Add Currency to Virtual App', async () => {
    var app, admin;

    before( async () =>  {
        app = global.test.virtual_app;
        admin = global.test.virtual_admin;
    });

    it('should be able to add currency bank ETH to app', mochaAsync(async () => {

        /* Get Available Currencies */
        const eco_data = (await getEcosystemData()).data.message;
        const eco_currencies = eco_data.currencies;
        const currency = eco_currencies.find( c => new String(c.ticker).toLowerCase() == 'eth')

        const postData = {
            app : app.id,
            passphrase : 'test278dbgwiu2179',
            currency_id : currency._id
        };

        /* Guarantee Currency Added with Success to Wallet */
        let res = await addCurrencyWalletToApp({...postData, admin: admin.id}, admin.bearerToken , {id : admin.id});
        expect(detectValidationErrors(res)).to.be.equal(false);
        const { status } = res.data;
        expect(status).to.be.equal(200);
        
        /* Verify if new wallet has that info */
        let res_app = await getAppAuth({...get_app(app.id), admin: admin.id}, admin.bearerToken, {id : admin.id});

        const { wallet } = res_app.data.message;
        expect(wallet.length).to.be.equal(1);
        const walletCurrencyApp = wallet.find( c => new String(c.currency.ticker).toLowerCase() == 'eth');
        expect(walletCurrencyApp).to.not.be.null;
        expect(walletCurrencyApp.currency._id).to.be.equal(postData.currency_id);
        expect(walletCurrencyApp.bank_address).to.not.be.null;
        expect(walletCurrencyApp.playBalance).to.be.equal(0);

    }));


    it('should be able to add virtual currency to virtual app', mochaAsync(async () => {

        /* Get Available Currencies */
        const eco_data = (await getEcosystemData()).data.message;
        const eco_currencies = eco_data.currencies;
        const currency = eco_currencies.find( c => c.virtual);

        const postData = {
            app : app.id,
            passphrase: 'test278dbgwiu2179',
            currency_id : currency._id
        };

        /* Guarantee Currency Added with Success to Wallet */

        let res = await addCurrencyWalletToApp({...postData, admin: admin.id}, admin.bearerToken , {id : admin.id});
        expect(detectValidationErrors(res)).to.be.equal(false);
        const { status } = res.data;
        expect(status).to.be.equal(200);
        
        /* Verify if new wallet has that info */
        let res_app = await getAppAuth({...get_app(app.id), admin: admin.id}, admin.bearerToken, {id : admin.id});
        const { wallet } = res_app.data.message;
        expect(wallet.length).to.be.equal(2);
        const walletCurrencyApp = wallet.find( c => c.currency.virtual == true);
        expect(walletCurrencyApp).to.not.be.null;
        expect(walletCurrencyApp.currency._id).to.be.equal(postData.currency_id);
        expect(walletCurrencyApp.playBalance).to.be.equal(0);

        expect(walletCurrencyApp.price.length).to.be.equal(1);
    }));


    it('should be able to add currency bank BTC to app', mochaAsync(async () => {

        /* Get Available Currencies */
        const eco_data = (await getEcosystemData()).data.message;
        const eco_currencies = eco_data.currencies;
        const currency = eco_currencies.find( c => new String(c.ticker).toLowerCase() == 'btc')

        const postData = {
            app : app.id,
            passphrase : 'test278dbgwiu2179',
            currency_id : currency._id
        };

        /* Guarantee Currency Added with Success to Wallet */

        let res = await addCurrencyWalletToApp({...postData, admin: admin.id}, admin.bearerToken , {id : admin.id});
        expect(detectValidationErrors(res)).to.be.equal(false);
        const { status } = res.data;
        expect(status).to.be.equal(200);
        
        /* Verify if new wallet has that info */
        let res_app = await getAppAuth({...get_app(app.id), admin: admin.id}, admin.bearerToken, {id : admin.id});

        const { wallet } = res_app.data.message;
        expect(wallet.length).to.be.equal(3);
        const walletCurrencyApp = wallet.find( c => new String(c.currency.ticker).toLowerCase() == 'btc');
        expect(walletCurrencyApp).to.not.be.null;
        expect(walletCurrencyApp.currency._id).to.be.equal(postData.currency_id);
        expect(walletCurrencyApp.bank_address).to.not.be.null;
        expect(walletCurrencyApp.playBalance).to.be.equal(0);

          
        /* Verify if new wallet has that info */
        res_app = await getAppAuth({...get_app(app.id), admin: admin.id}, admin.bearerToken, {id : admin.id});

        const wallet_1 = res_app.data.message.wallet;
        expect(wallet_1.length).to.be.equal(3);
        const walletCurrencyAppVirtual = wallet_1.find( c => c.currency.virtual == true);
        expect(walletCurrencyAppVirtual.price.length).to.be.equal(2);
    }));

});
