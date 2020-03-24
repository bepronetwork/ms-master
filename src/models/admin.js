import { AdminLogic } from '../logic';
import ModelComponent from './modelComponent';
import { AdminsRepository } from '../db/repos';
import {
    MapperAddAdminSingleton,
    MapperAuthAdminSingleton,
    MapperEditAdminTypeSingleton,
    MapperGetAdminAllSingleton,
    MapperLoginAdminSingleton,
    MapperLogin2faAdminSingleton,
    MapperRegisterAdminSingleton,
    MapperSet2FASingleton
} from "../controllers/Mapper";
import Security from './security';
import Permission from "./permission";
// const saveOutputTest = require('../../test/outputTest/configOutput')

class Admin extends ModelComponent {

    constructor(params) {

        let db = new AdminsRepository();

        super(
            {
                name: 'Admin',
                logic: new AdminLogic({ db: db }),
                db: db,
                self: null,
                params: params,
                children: [
                    new Security(params),
                    new Permission(params)
                ]
            }
        );
    }

    async auth() {
        try {
            let res = await this.process('Auth');
            let test = MapperAuthAdminSingleton.output('Auth', res);
            console.log("Auth:: ", test)
            // saveOutputTest.saveOutputTest(`AdminTest`, `Auth`, test);
            return MapperAuthAdminSingleton.output('Auth', res);
        } catch (err) {
            throw err;
        }
    }

    async getAdminAll() {
        try {
            let res = await this.process('GetAdminAll');
            test = MapperGetAdminAllSingleton.output('GetAdminAll', res);
            console.log("GetAdminAll:: ", test)
            // saveOutputTest.saveOutputTest(`AdminTest`, `GetAdminAll`, test);
            return MapperGetAdminAllSingleton.output('GetAdminAll', res);
        } catch (err) {
            throw err;
        }
    }

    async login() {
        try {
            let res = await this.process('Login');
            let test = MapperLoginAdminSingleton.output('Login', res);
            console.log("Login:: ", test)
            // saveOutputTest.saveOutputTest(`AdminTest`, `Login`, test);
            return MapperLoginAdminSingleton.output('Login', res);
        } catch (err) {
            throw err;
        }
    }

    async login2FA() {
        try {
            let res = await this.process('Login2FA');
            let test = MapperLogin2faAdminSingleton.output('Login2FA', res);
            console.log("Login2FA:: ", test)
            // saveOutputTest.saveOutputTest(`AdminTest`, `Login2FA`, test);
            return MapperLogin2faAdminSingleton.output('Login2FA', res);
        } catch (err) {
            throw err;
        }
    }

    async set2FA() {
        try {
            let res = await this.process('Set2FA');
            let test = MapperSet2FASingleton.output('Set2fa', res);
            console.log("Set2fa:: ", test)
            // saveOutputTest.saveOutputTest(`AdminTest`, `Set2FA`, test);
            return MapperSet2FASingleton.output('Set2fa', res);
        } catch (err) {
            throw err;
        }
    }

    async addAdmin() {
        try {
            let res = await this.process('AddAdmin');
            let test = MapperAddAdminSingleton.output('AddAdmin', res);
            console.log("AddAdmin:: ", test)
            // saveOutputTest.saveOutputTest(`AdminTest`, `AddAdmin`, test);
            return MapperAddAdminSingleton.output('AddAdmin', res);
        } catch (err) {
            throw err;
        }
    }
    async register() {
        try {
            let res = await this.process('Register');
            let test = MapperRegisterAdminSingleton.output('Register', res);
            console.log("Register:: ", test)
            // saveOutputTest.saveOutputTest(`AdminTest`, `Register`, test);
            return MapperRegisterAdminSingleton.output('Register', res);
        } catch (err) {
            throw err;
        }
    }

    async editAdminType() {
        try {
            let res = await this.process('EditAdminType');
            let test = MapperEditAdminTypeSingleton.output('EditAdminType', res);
            console.log("EditAdminType:: ", test)
            // saveOutputTest.saveOutputTest(`AdminTest`, `EditAdminType`, test);
            return MapperEditAdminTypeSingleton.output('EditAdminType', res);
        } catch (err) {
            throw err;
        }
    }

}

export default Admin;
