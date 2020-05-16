import {
    getUserAuth,
    placeBet,
    authAdmin,
    loginUser,
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

var constant = {
    admin : {
        id : '5e49621025bc260021571580',
        bearerToken : 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IkF1dGgvNWU0OTYyMTAyNWJjMjYwMDIxNTcxNTgwIiwidGltZSI6MTU5MTAxMjU4MDI4OSwiaWF0IjoxNTg4NDIwNTgwfQ.OHfSmvrpWdXPAYQ9zkVxBca_t8BWLeWoqoLMx_CJIJpdscCAfgXEFCxXUWDRPlS8oOg3BH6dG99j6AnAXVFq_g'
    },
    app : {
        id : '5e486f7b85e6fa0021c827d7'
    },
    user : {
        id : '5e776d2726c551002172ecd9',
        username : 'jeremy',
        password : 'test123',
        bearerToken : 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IkF1dGgvNWU3NzZkMjcyNmM1NTEwMDIxNzJlY2Q5IiwidGltZSI6MTU4ODg4MTI0NDgyNCwiaWF0IjoxNTg2Mjg5MjQ0fQ.BlqROIKMl-NaI_57ylFAsShhH86lzTWS7zDLF6nYlOELf2yYPAB2_-brBKyrUrmUizQ9z6GgUJHWEJN1RJFQ-A'
    }
}

context('Bet Errors Exploit - Prevention', async () => {
    var app, walletApp, user, admin, betAmount, game, ticker = 'eth',postDataDefault, currency, bet;

    const insideBetFunction = async ({postData}) => {
        user = (await getUserAuth({user : constant.user.id, app: app.id}, constant.user.bearerToken, {id : constant.user.id})).data.message;
        app = (await getAppAuth({app : constant.app.id, admin: constant.admin.id}, constant.admin.bearerToken, {id : constant.admin.id})).data.message;
        var userPreBetCurrencyWallet = user.wallet.find( w => new String(w.currency.ticker).toLowerCase() == new String(ticker).toLowerCase());
        var appPreBetCurrencyWallet = app.wallet.find( w => new String(w.currency.ticker).toLowerCase() == new String(ticker).toLowerCase());
        var res = await placeBet(postData, user.bearerToken, {id : user.id});
        var isWon = res.data.message.isWon;
        return { 
            isWon, res, userPreBetCurrencyWallet, appPreBetCurrencyWallet
        }
    }

    const beforeBetFunction = async ({metaName}) => {
        game = app.games.find( game => game.metaName == metaName);
        user = (await getUserAuth({user : constant.user.id, app: app.id}, constant.user.bearerToken, {id : constant.user.id})).data.message;
        return {
            game, user
        }
    }

    
    before( async () =>  {
        betAmount = 0.001;
        admin = (await authAdmin({ admin : constant.admin.id }, constant.admin.bearerToken, { id : constant.admin.id})).data.message;
        constant.user.bearerToken = (await loginUser({username : constant.user.username, password : constant.user.password, app : constant.app.id})).data.message.bearerToken;
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

    /* wheel_simple */

  
    it(`it shound´t be able to bet different amounts on wheel_simple`, mochaAsync(async () => {

        await beforeBetFunction({
            metaName : 'wheel_simple'
        })

        let postData = {  
            ...postDataDefault,
            game: game._id,
            result: game.resultSpace.map( (r, i) => {return {
                place: i, value : i/10000
            }})
        };

        let { res } =await insideBetFunction({ postData});
        expect(res.data.status).to.equal(13);
    }));

    it(`it shound´t be able to bet, not all events are present on wheel_simple`, mochaAsync(async () => {

        await beforeBetFunction({
            metaName : 'wheel_simple'
        })

        let postData = {  
            ...postDataDefault,
            game: game._id,
            result: [{
                place: 0, value : betAmount/10000,
                place: 4, value : betAmount/10000
            }]
        };

        let { res } = await insideBetFunction({postData});
        expect(res.data.status).to.equal(13);
    }));

    it(`it shound´t be able to bet the same place on wheel_simple`, mochaAsync(async () => {

        await beforeBetFunction({
            metaName : 'wheel_simple'
        })

        let postData = {  
            ...postDataDefault,
            game: game._id,
            result: game.resultSpace.map( (r, i) => {return {
                place: 0, value: betAmount/(game.resultSpace.length)
            }})
        };

        let { res } =await insideBetFunction({ postData});
        expect(res.data.status).to.equal(13);
    }));
    
    it(`it shound´t be able to bet negative values on wheel_simple`, mochaAsync(async () => {

        await beforeBetFunction({
            metaName : 'wheel_simple'
        })

        let postData = {  
            ...postDataDefault,
            game: game._id,
            result: game.resultSpace.map( (r, i) => {return {
                place: i, value: -(betAmount/(game.resultSpace.length))
            }})
        };

        let { res } = await insideBetFunction({ postData});
        expect(res.data.status).to.equal(13);
    }));

    it(`it shound´t be able to bet with no less than the result space length on wheel_simple`, mochaAsync(async () => {

        await beforeBetFunction({
            metaName : 'wheel_simple'
        })

        let result = game.resultSpace.map( (r, i) => {return {
            place: i, value: (betAmount/(game.resultSpace.length))
        }});

        result.pop();

        let postData = {  
            ...postDataDefault,
            game: game._id,
            result: result
        };

        let { res } = await insideBetFunction({ postData});
        expect(res.data.status).to.equal(13);
    }));

    it(`it shound´t be able to bet with no more than the result space length on wheel_simple`, mochaAsync(async () => {

        await beforeBetFunction({
            metaName : 'wheel_simple'
        })

        let result = game.resultSpace.map( (r, i) => {return {
            place: i, value: (betAmount/(game.resultSpace.length))
        }});

        result.push( {place : game.resultSpace.length+1, value: (betAmount/(game.resultSpace.length))})

        let postData = {  
            ...postDataDefault,
            game: game._id,
            result: result
        };

        let { res } = await insideBetFunction({ postData});
        expect(res.data.status).to.equal(13);
    }));

    /* wheel_variation_1 */

    it(`it shound´t be able to bet different amounts on wheel_variation_1`, mochaAsync(async () => {

        await beforeBetFunction({
            metaName : 'wheel_variation_1'
        })

        let postData = {  
            ...postDataDefault,
            game: game._id,
            result: game.resultSpace.map( (r, i) => {return {
                place: i, value : i/10000
            }})
        };

        let { res } =await insideBetFunction({ postData});
        expect(res.data.status).to.equal(13);
    }));

    it(`it shound´t be able to bet, not all events are present on wheel_variation_1`, mochaAsync(async () => {

        await beforeBetFunction({
            metaName : 'wheel_variation_1'
        })

        let postData = {  
            ...postDataDefault,
            game: game._id,
            result: [{
                place: 0, value : betAmount/10000,
                place: 4, value : betAmount/10000
            }]
        };

        let { res } = await insideBetFunction({postData});
        expect(res.data.status).to.equal(13);
    }));

    it(`it shound´t be able to bet the same place on wheel_variation_1`, mochaAsync(async () => {

        await beforeBetFunction({
            metaName : 'wheel_variation_1'
        })

        let postData = {  
            ...postDataDefault,
            game: game._id,
            result: game.resultSpace.map( (r, i) => {return {
                place: 0, value: betAmount/(game.resultSpace.length)
            }})
        };

        let { res } =await insideBetFunction({ postData});
        expect(res.data.status).to.equal(13);
    }));
    
    it(`it shound´t be able to bet negative values on wheel_variation_1`, mochaAsync(async () => {

        await beforeBetFunction({
            metaName : 'wheel_variation_1'
        })

        let postData = {  
            ...postDataDefault,
            game: game._id,
            result: game.resultSpace.map( (r, i) => {return {
                place: i, value: -(betAmount/(game.resultSpace.length))
            }})
        };

        let { res } = await insideBetFunction({ postData});
        expect(res.data.status).to.equal(13);
    }));

    it(`it shound´t be able to bet with no less than the result space length on wheel_variation_1`, mochaAsync(async () => {

        await beforeBetFunction({
            metaName : 'wheel_variation_1'
        })

        let result = game.resultSpace.map( (r, i) => {return {
            place: i, value: (betAmount/(game.resultSpace.length))
        }});

        result.pop();

        let postData = {  
            ...postDataDefault,
            game: game._id,
            result: result
        };

        let { res } = await insideBetFunction({ postData});
        expect(res.data.status).to.equal(13);
    }));

    it(`it shound´t be able to bet with no more than the result space length on wheel_variation_1`, mochaAsync(async () => {

        await beforeBetFunction({
            metaName : 'wheel_variation_1'
        })

        let result = game.resultSpace.map( (r, i) => {return {
            place: i, value: (betAmount/(game.resultSpace.length))
        }});

        result.push( {place : game.resultSpace.length+1, value: (betAmount/(game.resultSpace.length))})

        let postData = {  
            ...postDataDefault,
            game: game._id,
            result: result
        };

        let { res } = await insideBetFunction({ postData});
        expect(res.data.status).to.equal(13);
    }));

    /* plinko_variation_1 */

    it(`it shound´t be able to bet different amounts on plinko_variation_1`, mochaAsync(async () => {

        await beforeBetFunction({
            metaName : 'plinko_variation_1'
        })

        let postData = {  
            ...postDataDefault,
            game: game._id,
            result: game.resultSpace.map( (r, i) => {return {
                place: i, value : i/10000
            }})
        };

        let { res } =await insideBetFunction({ postData});
        expect(res.data.status).to.equal(13);
    }));

    it(`it shound´t be able to bet, not all events are present on plinko_variation_1`, mochaAsync(async () => {

        await beforeBetFunction({
            metaName : 'plinko_variation_1'
        })

        let postData = {  
            ...postDataDefault,
            game: game._id,
            result: [{
                place: 0, value : betAmount/10000,
                place: 4, value : betAmount/10000
            }]
        };

        let { res } = await insideBetFunction({postData});
        expect(res.data.status).to.equal(13);
    }));

    it(`it shound´t be able to bet the same place on plinko_variation_1`, mochaAsync(async () => {

        await beforeBetFunction({
            metaName : 'plinko_variation_1'
        })

        let postData = {  
            ...postDataDefault,
            game: game._id,
            result: game.resultSpace.map( (r, i) => {return {
                place: 0, value: betAmount/(game.resultSpace.length)
            }})
        };

        let { res } =await insideBetFunction({ postData});
        expect(res.data.status).to.equal(13);
    }));
    
    it(`it shound´t be able to bet negative values on plinko_variation_1`, mochaAsync(async () => {

        await beforeBetFunction({
            metaName : 'plinko_variation_1'
        })

        let postData = {  
            ...postDataDefault,
            game: game._id,
            result: game.resultSpace.map( (r, i) => {return {
                place: i, value: -(betAmount/(game.resultSpace.length))
            }})
        };

        let { res } = await insideBetFunction({ postData});
        expect(res.data.status).to.equal(13);
    }));

    it(`it shound´t be able to bet with no less than the result space length on plinko_variation_1`, mochaAsync(async () => {

        await beforeBetFunction({
            metaName : 'plinko_variation_1'
        })

        let result = game.resultSpace.map( (r, i) => {return {
            place: i, value: (betAmount/(game.resultSpace.length))
        }});

        result.pop();

        let postData = {  
            ...postDataDefault,
            game: game._id,
            result: result
        };

        let { res } = await insideBetFunction({ postData});
        expect(res.data.status).to.equal(13);
    }));

    it(`it shound´t be able to bet with no more than the result space length on plinko_variation_1`, mochaAsync(async () => {

        await beforeBetFunction({
            metaName : 'plinko_variation_1'
        })

        let result = game.resultSpace.map( (r, i) => {return {
            place: i, value: (betAmount/(game.resultSpace.length))
        }});

        result.push( {place : game.resultSpace.length+1, value: (betAmount/(game.resultSpace.length))})

        let postData = {  
            ...postDataDefault,
            game: game._id,
            result: result
        };

        let { res } = await insideBetFunction({ postData});
        expect(res.data.status).to.equal(13);
    }));

    /* coinflip_simple */

    it(`it shound´t be able to bet different amounts on coinflip_simple`, mochaAsync(async () => {

        await beforeBetFunction({
            metaName : 'coinflip_simple'
        })

        let postData = {  
            ...postDataDefault,
            game: game._id,
            result: game.resultSpace.map( (r, i) => {return {
                place: i, value : i/10000
            }})
        };

        let { res } =await insideBetFunction({ postData});
        expect(res.data.status).to.equal(13);
    }));

    it(`it shound´t be able to bet, not all events are present on coinflip_simple`, mochaAsync(async () => {

        await beforeBetFunction({
            metaName : 'coinflip_simple'
        })

        let postData = {  
            ...postDataDefault,
            game: game._id,
            result: [{
                place: 0, value : betAmount/10000,
                place: 4, value : betAmount/10000
            }]
        };

        let { res } = await insideBetFunction({postData});
        expect(res.data.status).to.equal(13);
    }));

    it(`it shound´t be able to bet the same place on coinflip_simple`, mochaAsync(async () => {

        await beforeBetFunction({
            metaName : 'coinflip_simple'
        })

        let postData = {  
            ...postDataDefault,
            game: game._id,
            result: game.resultSpace.map( (r, i) => {return {
                place: 0, value: betAmount/(game.resultSpace.length)
            }})
        };

        let { res } = await insideBetFunction({ postData});
        expect(res.data.status).to.equal(13);
    }));
    
    it(`it shound´t be able to bet negative values on coinflip_simple`, mochaAsync(async () => {

        await beforeBetFunction({
            metaName : 'coinflip_simple'
        })

        let postData = {  
            ...postDataDefault,
            game: game._id,
            result: game.resultSpace.map( (r, i) => {return {
                place: i, value: -(betAmount/(game.resultSpace.length))
            }})
        };

        let { res } = await insideBetFunction({ postData});
        expect(res.data.status).to.equal(13);
    }));

    it(`it shound´t be able to bet with no more than the result space length on coinflip_simple`, mochaAsync(async () => {

        await beforeBetFunction({
            metaName : 'coinflip_simple'
        })

        let result = game.resultSpace.map( (r, i) => {return {
            place: i, value: (betAmount/(game.resultSpace.length))
        }});

        result.push( {place : game.resultSpace.length+1, value: (betAmount/(game.resultSpace.length))})

        let postData = {  
            ...postDataDefault,
            game: game._id,
            result: result
        };

        let { res } = await insideBetFunction({ postData});
        expect(res.data.status).to.equal(13);
    }));

    /* linear_dice_simple */

    it(`it shound´t be able to bet different amounts on linear_dice_simple`, mochaAsync(async () => {

        await beforeBetFunction({
            metaName : 'linear_dice_simple'
        })

        let postData = {  
            ...postDataDefault,
            game: game._id,
            result: game.resultSpace.map( (r, i) => {return {
                place: i, value : i/10000
            }})
        };

        let { res } = await insideBetFunction({ postData});
        expect(res.data.status).to.equal(13);
    }));

    it(`it shound´t be able to bet, if the places are not together on linear_dice_simple`, mochaAsync(async () => {

        await beforeBetFunction({
            metaName : 'linear_dice_simple'
        })

        let postData = {  
            ...postDataDefault,
            game: game._id,
            result: [{
                place: 0, value : betAmount/10000,
                place: 4, value : betAmount/10000
            }]
        };

        let { res } = await insideBetFunction({postData});
        expect(res.data.status).to.equal(13);
    }));

    it(`it shound´t be able to bet the same place on linear_dice_simple`, mochaAsync(async () => {

        await beforeBetFunction({
            metaName : 'linear_dice_simple'
        })

        let postData = {  
            ...postDataDefault,
            game: game._id,
            result: game.resultSpace.map( (r, i) => {return {
                place: 0, value: betAmount/(game.resultSpace.length)
            }})
        };

        let { res } = await insideBetFunction({ postData});
        expect(res.data.status).to.equal(13);
    }));
    
    it(`it shound´t be able to bet negative values on linear_dice_simple`, mochaAsync(async () => {

        await beforeBetFunction({
            metaName : 'linear_dice_simple'
        })

        let postData = {  
            ...postDataDefault,
            game: game._id,
            result: game.resultSpace.map( (r, i) => {return {
                place: i, value: -(betAmount/(game.resultSpace.length))
            }})
        };

        let { res } = await insideBetFunction({ postData});
        expect(res.data.status).to.equal(13);
    }));

    it(`it should be able to bet with no less than the result space length on linear_dice_simple`, mochaAsync(async () => {

        await beforeBetFunction({
            metaName : 'linear_dice_simple'
        })

        let result = game.resultSpace.map( (r, i) => {return {
            place: i, value: (betAmount/(game.resultSpace.length))
        }});

        result.pop();

        let postData = {  
            ...postDataDefault,
            game: game._id,
            result: result
        };

        let { res } = await insideBetFunction({ postData});
        expect(res.data.status).to.equal(200);
    }));

    it(`it shound´t be able to bet with no more than the result space length on linear_dice_simple`, mochaAsync(async () => {

        await beforeBetFunction({
            metaName : 'linear_dice_simple'
        })

        let result = game.resultSpace.map( (r, i) => {return {
            place: i, value: (betAmount/(game.resultSpace.length))
        }});

        result.push( {place : game.resultSpace.length+1, value: (betAmount/(game.resultSpace.length))})

        let postData = {  
            ...postDataDefault,
            game: game._id,
            result: result
        };

        let { res } = await insideBetFunction({ postData});
        expect(res.data.status).to.equal(13);
    }));

     /* european_roulette_simple */

     it(`it should be able to bet different amounts on european_roulette_simple`, mochaAsync(async () => {

        await beforeBetFunction({
            metaName : 'european_roulette_simple'
        })

        let postData = {  
            ...postDataDefault,
            game: game._id,
            result: game.resultSpace.map( (r, i) => {return {
                place: i, value : betAmount/10
            }})
        };

        let { res } = await insideBetFunction({ postData});
        expect(res.data.status).to.equal(200);
    }));

    it(`it shound be able to bet, if the places are not together on european_roulette_simple`, mochaAsync(async () => {

        await beforeBetFunction({
            metaName : 'european_roulette_simple'
        })

        let postData = {  
            ...postDataDefault,
            game: game._id,
            result: [{
                place: 0, value : betAmount/10,
                place: 4, value : betAmount/10
            }]
        };

        let { res } = await insideBetFunction({postData});
        expect(res.data.status).to.equal(200);
    }));

    it(`it shound´t be able to bet the same place on european_roulette_simple`, mochaAsync(async () => {

        await beforeBetFunction({
            metaName : 'european_roulette_simple'
        })

        let postData = {  
            ...postDataDefault,
            game: game._id,
            result: game.resultSpace.map( (r, i) => {return {
                place: 0, value: betAmount/(game.resultSpace.length)
            }})
        };

        let { res } = await insideBetFunction({ postData});
        expect(res.data.status).to.equal(13);
    }));
    
    it(`it shound´t be able to bet negative values on european_roulette_simple`, mochaAsync(async () => {

        await beforeBetFunction({
            metaName : 'european_roulette_simple'
        })

        let postData = {  
            ...postDataDefault,
            game: game._id,
            result: game.resultSpace.map( (r, i) => {return {
                place: i, value: -(betAmount/(game.resultSpace.length))
            }})
        };

        let { res } = await insideBetFunction({ postData});
        expect(res.data.status).to.equal(13);
    }));

    it(`it should be able to bet with no less than the result space length on european_roulette_simple`, mochaAsync(async () => {

        await beforeBetFunction({
            metaName : 'european_roulette_simple'
        })

        let result = game.resultSpace.map( (r, i) => {return {
            place: i, value: (betAmount/(game.resultSpace.length))
        }});

        result.pop();

        let postData = {  
            ...postDataDefault,
            game: game._id,
            result: result
        };

        let { res } = await insideBetFunction({ postData});
        expect(res.data.status).to.equal(200);
    }));

    it(`it shound´t be able to bet with no more than the result space length on european_roulette_simple`, mochaAsync(async () => {

        await beforeBetFunction({
            metaName : 'european_roulette_simple'
        })

        let result = game.resultSpace.map( (r, i) => {return {
            place: i, value: (betAmount/(game.resultSpace.length))
        }});

        result.push( {place : game.resultSpace.length+1, value: (betAmount/(game.resultSpace.length))})

        let postData = {  
            ...postDataDefault,
            game: game._id,
            result: result
        };

        let { res } = await insideBetFunction({ postData});
        expect(res.data.status).to.equal(13);
    }));
});
