import {WalletLogic} from '../logic';
import {WalletsRepository} from '../db/repos';
import ModelComponent from './modelComponent';
import { MapperUpdateMaxDepositSingleton, MapperEditVirtualCurrencySingleton, UpdateMaxWithdrawSingleton, UpdateMinWithdrawSingleton, UpdateAffiliateMinWithdrawSingleton } from "../controllers/Mapper";

class Wallet extends ModelComponent{

    constructor(params){

        let db = new WalletsRepository();

        super(
            {
                name : 'Wallet', 
                logic : new WalletLogic({db : db}), 
                db : db,
                self : null, 
                params : params,
                children : []
            }
            );
    }

    async register(){
        try{
            return await this.process('Register');
        }catch(err){
            throw err;
        }
    }

    async editVirtualCurrency() {
        try{
            let res = await this.process('EditVirtualCurrency');
            return MapperEditVirtualCurrencySingleton.output('EditVirtualCurrency',res);
        }catch(err){
            throw err;
        }
    }

    async setMaxWithdraw(){
        try {
            let res = await this.process('UpdateMaxWithdraw');
            return UpdateMaxWithdrawSingleton.output('UpdateMaxWithdraw', res);
        }catch(err){
            throw err;
        }
    }

    async setMinWithdraw(){
        try {
            let res = await this.process('UpdateMinWithdraw');
            return UpdateMinWithdrawSingleton.output('UpdateMinWithdraw', res);
        }catch(err){
            throw err;
        }
    }

    async setAffiliateMinWithdraw(){
        try {
            let res = await this.process('UpdateAffiliateMinWithdraw');
            return UpdateAffiliateMinWithdrawSingleton.output('UpdateAffiliateMinWithdraw', res);
        }catch(err){
            throw err;
        }
    }

    async confirmDeposit(){
        try{
            return await this.process('ConfirmDeposit');
        }catch(err){
            throw err;
        }
    }

    async setMaxDeposit(){
        try {
            let res = await this.process('UpdateMaxDeposit');
            return MapperUpdateMaxDepositSingleton.output('UpdateMaxDeposit',res);
        }catch(err){
            throw err;
        }
    }

}

export default Wallet;