import {
    getSkinEcosystem
} from '../../../methods';

import { mochaAsync } from '../../../utils';
import chai from 'chai';
const expect = chai.expect;

context('Ecosystem Skin', async () => {
    var app, user

    before( async () =>  {
        app = global.test.app;
        user = global.test.user;
    });

    it('should Get Skin Ecosystem', mochaAsync(async () => {
        let res = await getSkinEcosystem();
        expect(res.data.status).to.not.null;
        expect(res.data.status).to.equal(200);
    }));
});

