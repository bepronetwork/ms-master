import {
    getLanguagesEcosystem
} from '../../../methods';

import { mochaAsync } from '../../../utils';
import chai from 'chai';
const expect = chai.expect;

context('Ecosystem Languages', async () => {
    var app, user

    before( async () =>  {
        app = global.test.app;
        user = global.test.user;
    });

    it('should Get Languages from Ecosystem', mochaAsync(async () => {
        let res = await getLanguagesEcosystem();
        expect(res.data.status).to.not.null;
        expect(res.data.status).to.equal(200);
    }));
});

