import {
    getApp
} from '../../../methods';

import chai from 'chai';
import models from '../../../models';

import {

} from '../../output/AppTestMethod';
import { mochaAsync } from '../../../utils';

const expect = chai.expect;

context('Deposit', async () =>  {
    var admin, app;

    before( async () =>  {
        app = global.test.app;
        admin = global.test.app;
    });

    it('should allow deposit for the User', mochaAsync(async () => {

        let res_user_loginUserin =  await loginUser(userPostData);
        USER_BEARER_TOKEN = res_user_loginUserin.data.message.bearerToken;
        USER_ID = res_user_loginUserin.data.message.id;

        const USER_DEPOSIT_AMOUNT = CONST.user.DEPOSIT_AMOUNT;
        const NONCE = getNonce();

        let resEthereum = await depositUser({
            amount : USER_DEPOSIT_AMOUNT,
            tokenAddress : PLATFORM_TOKEN_ADDRESS,
            platformAddress :  PLATFORM_ADDRESS,
            nonce : NONCE
        });

        let params = {
            user :  USER_ID,
            amount : USER_DEPOSIT_AMOUNT,
            app: APP_ID,
            nonce : NONCE,
            transactionHash: resEthereum.transactionHash
        }
        let res = await updateUserWallet(params, USER_BEARER_TOKEN, {id : USER_ID});
        expect(res.data.status).to.equal(200);

    }));

});

