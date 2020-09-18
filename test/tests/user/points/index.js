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
        app = global.test.app;
        currency = app.currencies[0]._id,
        await UsersRepository.prototype.updateUserPoints({ _id: user.id, value: 1})
        user = await UsersRepository.prototype.findUserById(user.id);
        userWalletBefore = user.wallet.find( w => new String(w.currency._id).toLowerCase() == new String(currency).toLowerCase());
        points = user.points
    });

    it('should Convert Points To Currency', mochaAsync(async () => {
        const postData = {
            app: app.id,
            currency,
            user: user._id,
            isAbsolut: true
        };
        let res = await convertPoints({...postData, admin: admin.id}, admin.security.bearerToken , {id : admin.id});
        expect(res.data.status).to.equal(200);
        userAfter = await UsersRepository.prototype.findUserById(user._id);
        userWalletAfter = userAfter.wallet.find( w => new String(w.currency._id).toLowerCase() == new String(currency).toLowerCase());
        expect(userWalletAfter.playBalance).to.equal(userWalletBefore.playBalance + points);
        expect(userAfter.points).to.equal(0);
    }));
});

