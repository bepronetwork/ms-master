import {
    convertPoints
} from '../../../methods';
import { detectValidationErrors, mochaAsync } from '../../../utils';
import chai from 'chai';
import { UsersRepository } from '../../../../src/db/repos';

const expect = chai.expect;

context('Points', async () => {
    var app, admin, currency, user, userWalletBefore, userWalletAfter, userAfter, points;


    before( async () =>  {
        admin = global.test.admin;
        user = global.test.user;
        console.log("user:: ", user)
        app = global.test.app;
        currency = app.currencies[0]._id,
        userWalletBefore = user.wallet.find( w => new String(w.currency).toLowerCase() == new String(currency).toLowerCase());
        await UsersRepository.prototype.updateUserPoints({ _id: user.id, value: 1})
        user = await UsersRepository.prototype.findUserById(user.id);
        console.log("user2::", user)
    });

    it('should Convert Points To Currency', mochaAsync(async () => {
        const postData = {
            app: app.id,
            currency,
            user: "all",
            isAbsolut: true
        };
        let res = await convertPoints({...postData, admin: admin.id}, admin.security.bearerToken , {id : admin.id});
        expect(res.data.status).to.equal(200);
    }));
});

