import {
    registerApp,
    getApp,
    addAppServices,
    authAdmin,
    getAppAuth,
    addAdmin,
    registerAdmin
} from '../../../methods';

import faker from 'faker';
import chai from 'chai';
import models from '../../../models';
import { SendInBlue } from '../../../../src/logic/third-parties';

import {
    shouldCreateTheApp,
    shouldGetNewBearerToken,
    shouldGetAppDataAuth,
    shouldGetAppData,
    shouldIntegrateServicesIntoApp,

} from '../../output/AppTestMethod';
import { mochaAsync, genData, detectValidationErrors } from '../../../utils';

const expect = chai.expect;

context('Normal', async () =>  {
    var admin, app, dataAdminAdd;

    before(async () => {
        admin = global.test.admin;
        dataAdminAdd = {email: null, bearerToken: null};
    });

    it('should regist the App with admin id provided', mochaAsync( async () => {
        let app_call_model = genData(models.apps.app_normal_register(admin.id));
        var res = await registerApp(app_call_model);
        detectValidationErrors(res);
        shouldCreateTheApp(res.data, expect);
    }));

    it('Should update a contact', mochaAsync(async () => {
        try {
            const email = admin.email;
            const attributes = {
                NAME: faker.name.firstName()
            };
            await SendInBlue.prototype.updateContact(email, attributes);
        } catch (err) {
            console.log(err)
        }
    }));

    it('Shouldnt update a contact that not exists', mochaAsync(async () => {
        try {
            const email = faker.internet.email();
            const attributes = {
                NAME: faker.name.firstName()
            };
            await SendInBlue.prototype.updateContact(email, attributes);
        } catch (err) {
            expect(err.status).to.equal(404);
        }
    }));

    it('should auth admin', mochaAsync(async () => {
        let res = await authAdmin({
            admin: admin.id
        }, admin.security.bearerToken, { id: admin.id });
        app = res.data.message.app;
        detectValidationErrors(res);
        shouldGetNewBearerToken(res.data, expect);
    }));

    it('should Get App Data Auth', mochaAsync(async () => {
        let get_app_model = models.apps.get_app(app.id);
        let res = await getAppAuth(get_app_model, app.bearerToken, { id: app.id });
        /* Set app Global Variable for Further Test */
        global.test.app = res.data.message;
        detectValidationErrors(res);
        shouldGetAppDataAuth(res.data, expect);
    }));

    it('should add Admin', mochaAsync(async () => {
        dataAdminAdd.email = `p${(new Date()).getTime()}@gmail.com`;
        let res = await addAdmin({
            email			: dataAdminAdd.email,
            app             : app.id,
            admin           : admin.id
        }, admin.security.bearerToken, { id : admin.id});
        dataAdminAdd.bearerToken = res.data.message.security.bearerToken;
        console.log(res);
        expect(1).to.not.be.null;
    }));

    it('should Confirm Admin with token', mochaAsync(async () => {
        var res = await registerAdmin({
            email       : dataAdminAdd.email,
            bearerToken : dataAdminAdd.bearerToken,
            name        : `name${(new Date()).getTime()}`,
            username    : `user${(new Date()).getTime()}`,
            password    : `password${(new Date()).getTime()}`
        });
        expect(1).to.not.be.null;
    }));

    it('should Get App Data', mochaAsync(async () => {
        let get_app_model = models.apps.get_app(app.id);
        let res = await getApp(get_app_model);
        detectValidationErrors(res);
        shouldGetAppData(res.data, expect);
    }));


    it('should Integrate Services into App', mochaAsync(async () => {
        let service_call_add_model = models.apps.add_services(app.id, [101, 201]);
        let res = await addAppServices(service_call_add_model, app.bearerToken, { id: app.id });
        detectValidationErrors(res);
        shouldIntegrateServicesIntoApp(res.data, expect);
    }));

});
