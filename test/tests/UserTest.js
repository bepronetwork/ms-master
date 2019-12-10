import {
    registerUser,
    registerApp,
    loginAdmin,
    registerAdmin,
    loginUser,
    getUserBets,
} from '../methods';

import faker from 'faker';
import chai from 'chai';
import models from '../models';
import Random from '../tools/Random';
import { 
    shouldntRegisterTheUser,
    GETlast15BetsShouldAllow
} from "./output/UserTestMethod"

const expect = chai.expect;

const genData = (faker, data) => JSON.parse(faker.fake(JSON.stringify(data)));

/* UTILS FUNCTIONS */ 

const runSetup = async (calls) => {
    for (const key of Object.values(calls)) { 
        await key()
    }
}

var mochaAsync = (fn) => {
    return done => {
        fn.call().then(done, err => {
            done(err);
        });
    };
};


const BOILERPLATES = global.BOILERPLATES;
const CONST = global.CONST;    
   
context('User Testing', async () =>  {
    var ADMIN_ID, APP_ID, userPostData, USER_ID, USER_ADDRESS, USER_BEARER_TOKEN;

    it('🍳(setup)🍳', mochaAsync(async () => {

        await (async () => {

            const calls = {
                registerAdmin : async () => {
                    var res = await registerAdmin(BOILERPLATES.admins.NORMAL_REGISTER_2);
                    expect(res.data.status).to.equal(200);
                },
                loginAdmin : async () => {
                    var response_admin = await loginAdmin(BOILERPLATES.admins.NORMAL_REGISTER_2);
                    ADMIN_ID = response_admin.data.message.id;
                    return;
                },
                createApp : async () => {
                    let app_call_model = genData(faker, models.apps.app_normal_register(ADMIN_ID, CONST.ownerAccount.getAddress()));
                    var response = await registerApp(app_call_model);
                    APP_ID = response.data.message.id;
                    userPostData = genData(faker, models.users.normal_register('0x345634563456345', APP_ID));
                    return;
                },
                registerUser : async () => {
                    userPostData = genData(faker, models.users.normal_register('33y345345', APP_ID, {
                        username : 'Jac3messs234tss' + Math.floor(Math.random() * 34) + 18
                    }));
                    let response = await registerUser(userPostData);
                    USER_ID = response.data.message._id;
                    return;
                }
            }
            try{
                await runSetup(calls);
                expect(true).to.equal(true);
                return true;
            }catch(err){
                console.log(err)
                console.log("Error")
            }
        })()
    }));
    
    it('should register the User', mochaAsync(async () => {
        userPostData = genData(faker, models.users.normal_register('687678i678im' + Math.floor(Math.random() * 60) + 18, APP_ID, {
            username : '678im67im' + Random(10000, 23409234235463456)
        }));
        var res = await registerUser(userPostData);
        USER_ID = res.data.message._id;
        expect(res.data.status).to.equal(200);
    }));

    it('should´nt register the user', mochaAsync(async () => {
        var res = await registerUser(userPostData);
        shouldntRegisterTheUser(res.data, expect);
    })); 
    it('should login the User', mochaAsync(async () => {
        var res = await loginUser(userPostData);
        USER_BEARER_TOKEN = res.data.message.bearerToken;
        expect(res.data.status).to.equal(200);
    }));

    context('GET - User Data', mochaAsync( async () => {
        it('GET last 15 Bets - should allow', mochaAsync(async () => {
            let res_user_login =  await loginUser(userPostData);
            USER_BEARER_TOKEN = res_user_login.data.message.bearerToken;
            USER_ID = res_user_login.data.message.id;
            let postData = {
                user : USER_ID,
                size : 15
            };
            let res = await getUserBets(postData, USER_BEARER_TOKEN, { id : USER_ID});
            GETlast15BetsShouldAllow(res.data, expect);
        })); 
    }));
});

