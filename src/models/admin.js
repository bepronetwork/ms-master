import {AdminLogic} from '../logic';
import ModelComponent from './modelComponent';
import {AdminsRepository} from '../db/repos';
import { MapperSingleton } from '../controllers/Mapper/Mapper';
import Security from './security';
import Permission from "./permission";

class Admin extends ModelComponent{

    constructor(params){

        let db = new AdminsRepository();

        super(
            {
                name : 'Admin', 
                logic : new AdminLogic({db : db}), 
                db : db,
                self : null, 
                params : params,
                children : [
                    new Security(params),
                    new Permission(params)
                ]
            }
            );
    }
    
    async auth(){
        try{
            let res = await this.process('Auth');
            return MapperSingleton.output('Admin', res);
        }catch(err){
            throw err;
        }
    }

    async getAdminAll() {
        try{
            let res = await this.process('GetAdminAll');
            return res;
            // return MapperSingleton.output('Admin', res);
        }catch(err){
            throw err;
        }
    }

    async login(){
        try{
            let res = await this.process('Login');
            return MapperSingleton.output('Admin', res);
        }catch(err){
            throw err;
        }
    }

    async login2FA(){
        try{
            let res = await this.process('Login2FA');
            return MapperSingleton.output('Admin', res);
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

    async addAdmin() {
        try{
            let res = await this.process('AddAdmin');
            return res;
        }catch(err){
            throw err;
        }
    }
    async register(){
        try{
            let res =  await this.process('Register');
            return res;
        }catch(err){
            throw err;
        }
    }

    async editAdminTypeRequest(){
        try {
            return await this.process('EditAdminTypeRequest');
        } catch (err) {
            throw err;
        }
    }
    
}

export default Admin;
