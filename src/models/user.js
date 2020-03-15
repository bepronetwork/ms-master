import {UserLogic} from '../logic';
import ModelComponent from './modelComponent';
import {UsersRepository} from '../db/repos';
import { MapperRegisterUserSingleton, MapperLoginUserSingleton, MapperAuthUserSingleton, Mapperlogin2faUserSingleton, MapperSet2faUserSingleton } from "../controllers/Mapper";
import { Affiliate, Wallet, AffiliateLink } from '.';
import Security from './security';
const saveOutputTest = require('../../test/outputTest/configOutput')

class User extends ModelComponent{

    constructor(params){

        let db = new UsersRepository();

        super(
            {
                name : 'User', 
                logic : new UserLogic({db : db}), 
                db : db,
                self : null, 
                params : params,
                children : [
                    new Affiliate(params),
                    new Security(params)
                ]
            }
            );
    }

    async auth(){
        try{
            let res = await this.process('Auth');
            saveOutputTest.saveOutputTest(`UserTest`,`Auth`,res);
            return MapperAuthUserSingleton.output('AuthUser', res);
        }catch(err){
            throw err;
        }
    }

    async login(){
        try{
            let res = await this.process('Login');
            saveOutputTest.saveOutputTest(`UserTest`,`Login`,res);
            return MapperLoginUserSingleton.output('LoginRegister', res);
        }catch(err){
            throw err;
        }
    }

    async login2FA(){
        try{
            let res = await this.process('Login2FA');
            saveOutputTest.saveOutputTest(`UserTest`,`Login2FA`,res);
            return Mapperlogin2faUserSingleton.output('Login2faUser', res);
        }catch(err){
            throw err;
        }
    }

    async resetPassword() {
        try{
            let res = await this.process('ResetPassword');
            saveOutputTest.saveOutputTest(`UserTest`,`resetPassword`,res);
            return res;
        }catch(err){
            throw err;
        }
    }

    async setPassword() {
        try{
            let res = await this.process('SetPassword');
            saveOutputTest.saveOutputTest(`UserTest`,`setPassword`,res);
            return res;
        }catch(err){
            throw err;
        }
    }

    async set2FA(){
        try{
            let res = await this.process('Set2FA');
            saveOutputTest.saveOutputTest(`UserTest`,`Set2FA`,res);
            return MapperSet2faUserSingleton.output('Set2faUser', res);
        }catch(err){
            throw err;
        }
    }


    async register(){
        try{
            let res = await this.process('Register');
            return MapperRegisterUserSingleton.output('UserRegister', res);
        }catch(err){
            throw err;
        }
    }

    async summary(){
        try{
            let res = await this.process('Summary');
            saveOutputTest.saveOutputTest(`UserTest`,`summary`,res);
            return res;
        }catch(err){
            throw err;
        }
    }

    async getInfo(){
        try{
            let res = await this.process('GetInfo');
            saveOutputTest.saveOutputTest(`UserTest`,`getInfo`,res);
            return res;
        }catch(err){
            throw err;
        }
    }

    async confirmEmail(){
        try{
            let res = await this.process('ConfirmEmail');
            saveOutputTest.saveOutputTest(`UserTest`,`confirmEmail`,res);
            return res;    
        }catch(err){
            throw err;
        }
    }

    async getDepositAddress(){
        try{
           let res = await this.process('GetDepositAddress');
           saveOutputTest.saveOutputTest(`UserTest`,`getDepositAddress`,res);
           return res;
        }catch(err){
            throw err;
        }
    }

    async updateWallet(){
        const { user } = this.self.params;
        try{
            let res = await this.process('UpdateWallet');
            saveOutputTest.saveOutputTest(`UserTest`,`updateWallet`,res);
            return res;
        }catch(err){
            throw err;
        }
    }
    

     /**
     * @param {String} 
     * @return {bool || Exception}  
     */

    async createAPIToken(){
        try{
            let res =  await this.process('CreateAPIToken');
            saveOutputTest.saveOutputTest(`UserTest`,`CreateAPIToken`,res);
            return res.bearerToken;
        }catch(err){
            throw err;
        }
    }

    async getBets(){
        try{
            let res = await this.process('GetBets');
            saveOutputTest.saveOutputTest(`UserTest`,`getBets`,res);
            return res;
        }catch(err){
            throw err;
        }
    }

}

export default User;
