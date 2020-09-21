import {
    editCripsrIntegration
} from '../../../methods';
import chai from 'chai';
import models from '../../../models';
import { mochaAsync, detectValidationErrors } from '../../../utils';
import Random from '../../../tools/Random';
import faker from 'faker';
import IntegrationsRepository from '../../../../src/db/repos/integrations';
const genData = (faker, data) => JSON.parse(faker.fake(JSON.stringify(data)));

const BOILERPLATES = global.BOILERPLATES;
const expect = chai.expect;

context('Cripsr', async () =>  {
    var app, admin, user, userPostData;


    before( async () =>  {
        app = global.test.app;
        admin = global.test.admin;
    });

    it('should Edit Cripsr', mochaAsync(async () => {
        let integrations = await IntegrationsRepository.prototype.findById(app.integrations)
        let postData = {
            app: app.id,
            admin: admin.id,
            cripsr_id: integrations.cripsr,
            key: "test",
            isActive: true
        }
        let res = await editCripsrIntegration(postData , admin.security.bearerToken , {id : admin.id})
        expect(res.data.status).to.equal(200);
    }));
});
