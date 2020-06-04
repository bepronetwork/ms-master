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
    MapperUserGetBetsSingleton
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

    async auth() {
        try {
            let res = await this.process('Auth');
            return MapperAuthUserSingleton.output('AuthUser', res);
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
        // No Output
        try {
            let res = await this.process('GetInfo');
            return res;
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
        const { user } = this.self.params;
        try {
            let res = await this.process('UpdateWallet');
            return res;
        } catch (err) {
            throw err;
        }
    }

    async getBets() {
        try {
            let res = await this.process('GetBets');
            return MapperGetBetsSingleton.output('GetBets', res);
        } catch (err) {
            throw err;
        }
    }

}

export default User;
