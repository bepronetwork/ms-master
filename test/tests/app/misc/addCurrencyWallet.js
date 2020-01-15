import chai from 'chai';
import { mochaAsync, detectValidationErrors } from '../../../utils';
import { getAppAuth, addCurrencyWalletToApp, getEcosystemData } from '../../../methods';
import { get_app } from '../../../models/apps';
import { deploySmartContract, deploySmartContractETH } from '../../../utils/eth';
const expect = chai.expect;

context('Add Currency Wallet', async () => {
    var app, ercTokenTicker = 'sai';

    before( async () =>  {
        app = global.test.app;
    });


    it(`should be able to add currency bank ERC-20 to app (${ercTokenTicker})`, mochaAsync(async () => {

        /* Get Available Currencies */
        const eco_data = (await getEcosystemData()).data.message;
        const eco_currencies = eco_data.currencies;
        const currency = eco_currencies.find( c => new String(c.ticker).toLowerCase() == ercTokenTicker.toLowerCase())

        let { platformAddress } = await deploySmartContract({
            tokenAddress : currency.address, 
            decimals : currency.decimals,
            eth_account : global.ownerAccount,
            authorizedAddresses : [global.ownerAccount.getAddress()],
            croupierAddress : eco_data.addresses[0]
        });

        const postData = {
            app : app.id,
            bank_address : platformAddress,
            currency_id : currency._id
        };

        /* Guarantee Currency Added with Success to Wallet */

        let res = await addCurrencyWalletToApp(postData, app.bearerToken , {id : app.id});
        expect(detectValidationErrors(res)).to.be.equal(false);
        const { status } = res.data;
        expect(status).to.be.equal(200);
        
        /* Verify if new wallet has that info */
        let res_app = await getAppAuth(get_app(app.id), app.bearerToken, {id : app.id});
        const { wallet } = res_app.data.message;

        expect(wallet.length).to.be.equal(1);

        const walletCurrencyApp = wallet.find( c => new String(c.currency.ticker).toLowerCase() == ercTokenTicker.toLowerCase());

        expect(walletCurrencyApp).to.not.be.null;
        expect(walletCurrencyApp.currency._id).to.be.equal(postData.currency_id);
        expect(walletCurrencyApp.bank_address).to.be.equal(postData.bank_address);
        expect(walletCurrencyApp.playBalance).to.be.equal(0);
    }));

    it('should be able to add currency bank ETH to app', mochaAsync(async () => {

        /* Get Available Currencies */
        const eco_data = (await getEcosystemData()).data.message;
        const eco_currencies = eco_data.currencies;
        const currency = eco_currencies.find( c => new String(c.ticker).toLowerCase() == 'eth')

        let { platformAddress } = await deploySmartContractETH({
            eth_account : global.ownerAccount,
            authorizedAddresses : [global.ownerAccount.getAddress()],
            croupierAddress : eco_data.addresses[0]
        });

        const postData = {
            app : app.id,
            bank_address : platformAddress,
            currency_id : currency._id
        };

        /* Guarantee Currency Added with Success to Wallet */

        let res = await addCurrencyWalletToApp(postData, app.bearerToken , {id : app.id});
        expect(detectValidationErrors(res)).to.be.equal(false);
        const { status } = res.data;
        expect(status).to.be.equal(200);
        
        /* Verify if new wallet has that info */
        let res_app = await getAppAuth(get_app(app.id), app.bearerToken, {id : app.id});
        global.test.app = res_app.data.message;

        const { wallet } = res_app.data.message;
        expect(wallet.length).to.be.equal(2);

        const walletCurrencyApp = wallet.find( c => new String(c.currency.ticker).toLowerCase() == 'eth');
        expect(walletCurrencyApp).to.not.be.null;
        expect(walletCurrencyApp.currency._id).to.be.equal(postData.currency_id);
        expect(walletCurrencyApp.bank_address).to.be.equal(postData.bank_address);
        expect(walletCurrencyApp.playBalance).to.be.equal(0);

    }));

    it('should´t be able to add wallet balance without valid currency id', mochaAsync(async () => {

        const postData = {
            app : app.id,
            bank_address : '0x',
            currency_id : "45763"
        };

        /* Guarantee Currency Added with Success to Wallet */

        let res = await addCurrencyWalletToApp(postData, app.bearerToken , {id : app.id});
        expect(detectValidationErrors(res)).to.be.equal(false);
        const { status } = res.data;
        expect(status).to.be.equal(404);
    }));

    it('should verify if user wallets are also updated and added for each currency', mochaAsync(async () => {

    }));

    it(`shouldn´t be able to replace app ERC-20 wallet (${ercTokenTicker})`, mochaAsync(async () => {
        /* Get Available Currencies */
        const eco_data = (await getEcosystemData()).data.message;
        const eco_currencies = eco_data.currencies;
        const currency = eco_currencies.find( c => new String(c.ticker).toLowerCase() == ercTokenTicker.toLowerCase())

        let { platformAddress } = await deploySmartContract({
            tokenAddress : currency.address, 
            decimals : currency.decimals,
            eth_account : global.ownerAccount,
            authorizedAddresses : [global.ownerAccount.getAddress()],
            croupierAddress : eco_data.addresses[0]
        });

        const postData = {
            app : app.id,
            bank_address : platformAddress,
            currency_id : currency._id
        };

        /* Guarantee Currency Added with Success to Wallet */

        let res = await addCurrencyWalletToApp(postData, app.bearerToken , {id : app.id});
        expect(detectValidationErrors(res)).to.be.equal(false);
        const { status } = res.data;
        expect(status).to.be.equal(46);
    }));

});
