import { UserLogic } from '../logic';
import ModelComponent from './modelComponent';
import { UsersRepository, AppRepository } from '../db/repos';
import {
    MapperRegisterUserSingleton,
    MapperLoginUserSingleton,
    MapperAuthUserSingleton,
    Mapperlogin2faUserSingleton,
    MapperSet2faUserSingleton,
    MapperGetDepositAddressUserSingleton,
    MapperGetBetsSingleton,
    MapperUserGetBetsSingleton,
    MapperGetBetsEsportsSingleton,
    MapperGetUserInfoSingleton
} from "../controllers/Mapper";
import { Affiliate, Wallet, AffiliateLink } from '.';
import Security from './security';

class User extends ModelComponent {

    constructor(params) {

        let db = new UsersRepository();

        super(
            {
                name: 'User',
                logic: new UserLogic({ db: db }),
                db: db,
                self: null,
                params: params,
                children: [
                    new Affiliate(params),
                    new Security(params)
                ]
            }
        );
    }

    async requesAffiliatetWithdraw(){
        // Output = Null
        const { user } = this.self.params;
        try{
            /* Close Mutex */
            await UsersRepository.prototype.changeWithdrawPosition(user, true);
            let res = await this.process('RequestAffiliateWithdraw');
            /* Open Mutex */
            await UsersRepository.prototype.changeWithdrawPosition(user, false);
            return res;
        }catch(err){
            if(parseInt(err.code) != 14){
                /* If not withdrawing atm */
                /* Open Mutex */
                await UsersRepository.prototype.changeWithdrawPosition(user, false);
            }
            throw err;
        }
    }

    async cancelWithdraw(){
        const { app } = this.self.params;
        try{
            /* Close Mutex */
            await AppRepository.prototype.changeWithdrawPosition(app, true);
            // Output = Boolean
            let res = await this.process('CancelWithdraw');
            /* Open Mutex */
            await AppRepository.prototype.changeWithdrawPosition(app, false);
            return res;
        }catch(err){
            if(parseInt(err.code) != 14){
                /* If not withdrawing atm */
                /* Open Mutex */
                await AppRepository.prototype.changeWithdrawPosition(app, false);
            }
            throw err;
        }
    }

    async providerToken() {
        try {
            return await this.process('ProviderToken');
        } catch (err) {
            throw err;
        }
    }
    async auth() {
        try {
            let res = await this.process('Auth');
            return MapperAuthUserSingleton.output('AuthUser', res);
        } catch (err) {
            throw err;
        }
    }

    async editKycNeeded() {
        try {
            return await this.process('EditKycNeeded');
        } catch (err) {
            throw err;
        }
    }

    async login() {
        try {
            let res = await this.process('Login');
            return MapperLoginUserSingleton.output('LoginRegister', res);
        } catch (err) {
            throw err;
        }
    }

    async resendEmail() {
        // Output = {}
        try {
            let res = await this.process('ResendEmail');
            return res;
        } catch (err) {
            throw err;
        }
    }

    async login2FA() {
        try {
            let res = await this.process('Login2FA');
            return Mapperlogin2faUserSingleton.output('Login2faUser', res);
        } catch (err) {
            throw err;
        }
    }

    async resetPassword() {
        // Output = Boolean
        try {
            let res = await this.process('ResetPassword');
            return res;
        } catch (err) {
            throw err;
        }
    }

    async setPassword() {
        // No Output
        try {
            let res = await this.process('SetPassword');
            return res;
        } catch (err) {
            throw err;
        }
    }

    async set2FA() {
        try {
            let res = await this.process('Set2FA');
            return MapperSet2faUserSingleton.output('Set2faUser', res);
        } catch (err) {
            throw err;
        }
    }


    async register() {
        try {
            let res = await this.process('Register');
            return MapperRegisterUserSingleton.output('UserRegister', res);
        } catch (err) {
            throw err;
        }
    }

    async summary() {
        try {
            let res = await this.process('Summary');
            return res;
        } catch (err) {
            throw err;
        }
    }

    async userGetBets() {
        try {
            let res = await this.process('UserGetBets');
            return MapperUserGetBetsSingleton.output('UserGetBets', res);
        } catch (err) {
            throw err;
        }
    }

    async getInfo() {
        try {
            let res = await this.process('GetInfo');
            return MapperGetUserInfoSingleton.output('GetUserInfo', res);
        } catch (err) {
            throw err;
        }
    }

    async confirmEmail() {
        // Output = {}
        try {
            let res = await this.process('ConfirmEmail');
            return res;
        } catch (err) {
            throw err;
        }
    }

    async getDepositAddress() {
        const { app } = this.self.params;
        /* Mutex In */
        try{
            let res = await this.process('GetDepositAddress');
            return MapperGetDepositAddressUserSingleton.output('GetDepositAddressUser', res);
        }catch(err){
            throw err;
        }
    }

    async updateWallet() {
        // No Output
        const { id } = this.self.params;
        console.log("UserId:: ", id)
        try {
            await UsersRepository.prototype.changeDepositPosition(id, true);
            let res = await this.process('UpdateWallet');
            UsersRepository.prototype.changeDepositPosition(id, false);
            return res;
        } catch (err) {
            console.log("Error Code: ",err.code)
            if(parseInt(err.code) != 82){
                console.log("NO ERROR MUTEX")
                console.log(err.data)
                /* If not depositing atm */
                /* Open Mutex */
                UsersRepository.prototype.changeDepositPosition(id, false);
            }
            throw err;
        }
    }

    async getBets() {
        try {
            var res ="";
            switch (this.self.params.tag) {
                case "cassino":
                    res = await this.process('GetBets');
                    return MapperGetBetsSingleton.output('GetBets', res);
                case "esports":
                    res = await this.process('GetBetsEsports');
                    return MapperGetBetsEsportsSingleton.output('GetBetsEsports', res);
                default:
                    res = await this.process('GetBets');
                    return MapperGetBetsSingleton.output('GetBets', res);
            }
        } catch (err) {
            throw err;
        }
    }

}

export default User;
