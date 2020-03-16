import {UserLogic} from '../logic';
import ModelComponent from './modelComponent';
import {UsersRepository} from '../db/repos';
import { MapperSingleton } from '../controllers/Mapper/Mapper';
import { MapperUserSingleton } from '../controllers/Mapper/MapperUser';
import { Affiliate, Wallet, AffiliateLink } from '.';
import Security from './security';

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
            return MapperSingleton.output('User', res);
        }catch(err){
            throw err;
        }
    }

    async login(){
        try{
            let res = await this.process('Login');
            return MapperSingleton.output('User', res);
        }catch(err){
            throw err;
        }
    }

    async resendEmail() {
        try {
            let res = await this.process('ResendEmail');
            return res;
        } catch(err) {
            throw err;
        }
    }

    async login2FA(){
        try{
            let res = await this.process('Login2FA');
            return MapperSingleton.output('User', res);
        }catch(err){
            throw err;
        }
    }

    async resetPassword() {
        try{
            let res = await this.process('ResetPassword');
            return res;
        }catch(err){
            throw err;
        }
    }

    async setPassword() {
        try{
            let res = await this.process('SetPassword');
            return res;
        }catch(err){
            throw err;
        }
    }

    async set2FA(){
        try{
            let res = await this.process('Set2FA');
            return res;
        }catch(err){
            throw err;
        }
    }

    async register(){
        try{
            let res = await this.process('Register');
            return MapperUserSingleton.output('UserRegister', res);
        }catch(err){
            throw err;
        }
    }

    async summary(){
        try{
            return await this.process('Summary');
        }catch(err){
            throw err;
        }
    }

    async getInfo(){
        try{
            return await this.process('GetInfo');
        }catch(err){
            throw err;
        }
    }

    async confirmEmail(){
        try{
            return await this.process('ConfirmEmail');
        }catch(err){
            throw err;
        }
    }

    async getDepositAddress(){
        try{
            return await this.process('GetDepositAddress');
        }catch(err){
            throw err;
        }
    }

    async updateWallet(){
        const { user } = this.self.params;
        try{
            let res = await this.process('UpdateWallet');
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
            return res.bearerToken;
        }catch(err){
            throw err;
        }
    }

    async getBets(){
        try{
            return await this.process('GetBets');
        }catch(err){
            throw err;
        }
    }

}

export default User;
