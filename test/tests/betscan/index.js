import {
    betscanGetBets,
    betscanGetBetsEsports,
    betscanGetUsers,
    betscanGetDeposits,
    betscanGetWithdraws
} from '../../methods';

import { mochaAsync } from '../../utils';
import chai from 'chai';
const expect = chai.expect;

context('Betscan', async () => {

    it('should Get Bets Casino for Betscan', mochaAsync(async () => {
        let res = await betscanGetBets();
        console.log("Res:: ",res)
        console.log("ResDATA:: ",res.data)
        expect(res.data.status).to.not.null;
        expect(res.data.status).to.equal(200);
    }));

    it('should Get Bets Esports for Betscan', mochaAsync(async () => {
        let res = await betscanGetBetsEsports();
        expect(res.data.status).to.not.null;
        expect(res.data.status).to.equal(200);
    }));

    it('should Get Users for Betscan', mochaAsync(async () => {
        let res = await betscanGetUsers();
        expect(res.data.status).to.not.null;
        expect(res.data.status).to.equal(200);
    }));

    it('should Get Deposits for Betscan', mochaAsync(async () => {
        let res = await betscanGetDeposits();
        expect(res.data.status).to.not.null;
        expect(res.data.status).to.equal(200);
    }));

    it('should Get Withdraws for Betscan', mochaAsync(async () => {
        let res = await betscanGetWithdraws();
        expect(res.data.status).to.not.null;
        expect(res.data.status).to.equal(200);
    }));
});

