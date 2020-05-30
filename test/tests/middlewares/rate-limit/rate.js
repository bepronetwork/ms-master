import {
    pingPostMiddleware
} from '../../../methods';

import { mochaAsync } from '../../../utils';
import chai from 'chai';
import delay from 'delay';
const expect = chai.expect;

context('Rate-Limit', async () => {
    var app;

    before( async () =>  {
        app = {
            id: "5e486f7b85e6fa0021c827d7"
        }
    });

    it('should max 100 request per secund', mochaAsync(async () => {
        for(let i=0;i<=100; i++){
            pingPostMiddleware({type: "global", app: app.id}, {}, {});
        }
        var res = await pingPostMiddleware({type: "global", app: app.id}, {}, {});
        await delay(60*1000);
        expect(res.status).to.equal(429);
    }));
});

