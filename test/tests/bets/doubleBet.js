import {
    getUserAuth,
    placeBet,
    authAdmin,
    getAppAuth
} from '../../methods';

import chai from 'chai';
import { mochaAsync, detectValidationErrors } from '../../utils';
import { getRandom } from '../../utils/math';
import { digestBetResult } from '../../utils/bet';

const expect = chai.expect;

 const currenciesBetAmount = {
    // add other currencies here
    'eth' : 0.001
}

const constant = {
    admin : {
        id : '5e49621025bc260021571580',
        bearerToken : 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IkF1dGgvNWU0OTYyMTAyNWJjMjYwMDIxNTcxNTgwIiwidGltZSI6MTU5MTAxMjU4MDI4OSwiaWF0IjoxNTg4NDIwNTgwfQ.OHfSmvrpWdXPAYQ9zkVxBca_t8BWLeWoqoLMx_CJIJpdscCAfgXEFCxXUWDRPlS8oOg3BH6dG99j6AnAXVFq_g'
    },
    app : {
        id : '5e486f7b85e6fa0021c827d7'
    },
    user : {
        id : '5e776d2726c551002172ecd9',
        bearerToken : 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IkF1dGgvNWU3NzZkMjcyNmM1NTEwMDIxNzJlY2Q5IiwidGltZSI6MTU4ODg4MTI0NDgyNCwiaWF0IjoxNTg2Mjg5MjQ0fQ.BlqROIKMl-NaI_57ylFAsShhH86lzTWS7zDLF6nYlOELf2yYPAB2_-brBKyrUrmUizQ9z6GgUJHWEJN1RJFQ-A'
    }
}
const betAmount = 0.001;

context('Double bet - Prevention', async () => {
    var app, walletApp, user, admin, betAmount, game, ticker = key,postDataDefault, currency, bet;
    

    const beforeBetFunction = async ({metaName}) => {
        game = app.games.find( game => game.metaName == metaName);
        user = (await getUserAuth({user : constant.user.id, app: app.id}, constant.user.bearerToken, {id : constant.user.id})).data.message;
        return {
            game, user
        }
    }

    before( async () =>  {
        admin = (await authAdmin({ admin : constant.admin.id }, constant.admin.bearerToken, { id : constant.admin.id})).data.message;
        user = (await getUserAuth({user : constant.user.id, app: constant.app.id}, constant.user.bearerToken, {id : constant.user.id})).data.message;
        app = (await getAppAuth({app : constant.app.id, admin: constant.admin.id}, constant.admin.bearerToken, {id : constant.admin.id})).data.message;
        currency = (app.wallet.find( w => new String(w.currency.ticker).toLowerCase() == new String(ticker).toLowerCase())).currency;
        walletApp = (app.wallet.find( w => new String(w.currency.ticker).toLowerCase() == new String(ticker).toLowerCase()));

        postDataDefault = {
            user: user.id,
            app: app.id,
            currency : currency._id,
            nonce: getRandom(123,2384723),
        }
    });

    it(`it should allow only 1 bet at a time`, mochaAsync(async () => {

        await beforeBetFunction({
            metaName : 'wheel_simple'
        })

        let postData = {  
            ...postDataDefault,
            game: game._id,
            result: game.resultSpace.map( (r, i) => {return {
                place: i, value: betAmount/(game.resultSpace.length)
            }})
        };


        var done = 0,not_done = 0;

        res.map( r => {
            if(r.data.status == 200){
                done+=1;
            }
            if(r.data.status == 14){
                not_done+=1;
            }
        })
        expect(done).to.equal(1);
        expect(not_done).to.equal(3);
    }));

  
    
});

