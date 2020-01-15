import {
    registerApp,
    getApp,
    addAppServices,
    authAdmin,
    getAppAuth
} from '../../../methods';

import chai from 'chai';
import models from '../../../models';

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
    var admin, app;


    before( async () =>  {
        admin = global.test.admin;
    });


    it('should regist the App with admin id provided', mochaAsync(async () => {
        let app_call_model = genData(models.apps.app_normal_register(admin.id));
        var res = await registerApp(app_call_model);
        detectValidationErrors(res);
        shouldCreateTheApp(res.data, expect);
    }));
    
    it('should auth admin', mochaAsync(async () => {
        let res = await authAdmin({
            admin : admin.id
        }, admin.security.bearerToken, { id : admin.id});
        app = res.data.message.app;
        detectValidationErrors(res);
        shouldGetNewBearerToken(res.data, expect);
    })); 

    it('should Get App Data Auth', mochaAsync(async () => {
        let get_app_model = models.apps.get_app(app.id);
        let res = await getAppAuth(get_app_model, app.bearerToken, {id : app.id});
        /* Set app Global Variable for Further Test */
        global.test.app = res.data.message;
        detectValidationErrors(res);
        shouldGetAppDataAuth(res.data, expect);

    })); 

    it('should Get App Data', mochaAsync(async () => {
        let get_app_model = models.apps.get_app(app.id);
        let res = await getApp(get_app_model);
        detectValidationErrors(res);
        shouldGetAppData(res.data, expect);
    })); 


    it('should Integrate Services into App', mochaAsync(async () => {
        let service_call_add_model = models.apps.add_services(app.id, [101, 201]);
        let res = await addAppServices(service_call_add_model, app.bearerToken, {id : app.id});
        detectValidationErrors(res);
        shouldIntegrateServicesIntoApp(res.data, expect);
    })); 

});
