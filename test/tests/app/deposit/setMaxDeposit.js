import chai from 'chai';
import { mochaAsync } from '../../../utils';
import { getAppAuth, setAppMaxDeposit } from '../../../methods';
import { get_app } from '../../../models/apps';

const expect = chai.expect;
var currencyWallet;

function updateCurrencyWallet(localTicker,app) {
    currencyWallet = app.wallet.find( w => new String(w.currency.ticker).toLowerCase() == new String(localTicker).toLowerCase());
}

context(`Set Max Deposit`, async () => {
    var app;

    before( async () =>  {
        app = (await getAppAuth(get_app(global.test.app.id), global.test.app.bearerToken, {id : global.test.app.id})).data.message;
        updateCurrencyWallet('ETH',app);
    });

    it('should set max for ETH success', mochaAsync(async () => {
        let dataMaxDeposit = await setAppMaxDeposit({
            app_id: app.id,
            wallet_id: currencyWallet._id,
            amount: 0.3,
        }, app.bearerToken, {id : app.id});
        expect(dataMaxDeposit.data.status).to.be.equal(200);
        expect(dataMaxDeposit.data.status).to.not.be.null;
    }));
    // it('should set max for ETH app is invalid', mochaAsync(async () => {
    //     let dataMaxDeposit = await setAppMaxDeposit({
    //         app_id: "1029102901",
    //         wallet_id: currencyWallet._id,
    //         amount: 1,
    //     }, app.bearerToken, {id : app.id});
    //     console.log(2, dataMaxDeposit);
    //     expect(dataMaxDeposit.data.status).to.be.equal(12);
    //     expect(dataMaxDeposit.data.status).to.not.be.null;
    // }));
    // it('should set max for ETH wallet is invalid', mochaAsync(async () => {
    //     let dataMaxDeposit = await setAppMaxDeposit({
    //         app_id: app.id,
    //         wallet_id: "345h3234234",
    //         amount: 1,
    //     }, app.bearerToken, {id : app.id});
    //     console.log(3, dataMaxDeposit);
    //     expect(dataMaxDeposit.data.status).to.be.equal(45);
    //     expect(dataMaxDeposit.data.status).to.not.be.null;
    // }));

    it('should set max for erc20 success', mochaAsync(async () => {
        updateCurrencyWallet('SAI', app);
        let dataMaxDeposit = await setAppMaxDeposit({
            app_id: app.id,
            wallet_id: currencyWallet._id,
            amount: 30,
        }, app.bearerToken, {id : app.id});
        expect(dataMaxDeposit.data.status).to.be.equal(200);
        expect(dataMaxDeposit.data.status).to.not.be.null;
    }));
    // it('should set max for erc20 app is invalid', mochaAsync(async () => {
    //     let dataMaxDeposit = await setAppMaxDeposit({
    //         app_id: "384573987",
    //         wallet_id: currencyWallet._id,
    //         amount: 30,
    //     }, app.bearerToken, {id : app.id});
    //     console.log(5, dataMaxDeposit);
    //     expect(dataMaxDeposit.data.status).to.be.equal(12);
    //     expect(dataMaxDeposit.data.status).to.not.be.null;
    // }));
    // it('should set max for erc20 wallet is invalid', mochaAsync(async () => {
    //     let dataMaxDeposit = await setAppMaxDeposit({
    //         app_id: app.id,
    //         wallet_id: "837459374598",
    //         amount: 30,
    //     }, app.bearerToken, {id : app.id});
    //     console.log(6, dataMaxDeposit);
    //     expect(dataMaxDeposit.data.status).to.be.equal(45);
    //     expect(dataMaxDeposit.data.status).to.not.be.null;
    // }));
});
