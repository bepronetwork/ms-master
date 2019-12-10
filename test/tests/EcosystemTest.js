import {
    getEcosystemData,
    getEcosystemCasinoGames
} from '../methods';

import chai from 'chai';
import { detectValidationErrors } from '../utils';
import { 
    getAllDataFromTheEcosystem,
    shouldGetAllEcosystemGames
} from './output/EcosystemMethod';

const expect = chai.expect;

/* UTILS FUNCTIONS */ 

var mochaAsync = (fn) => {
    return done => {
        fn.call().then(done, err => {
            done(err);
        });
    };
};
/* TESTS */

// Admin Normal Registering
context('Ecosystem Test', async () => {
    it('get all data from the Ecosystem', mochaAsync(async () => {
        var res = await getEcosystemData();
        getAllDataFromTheEcosystem(res.data, expect);
    }));

    it('should get All Ecosystem Games', mochaAsync(async () => {
        let res = await getEcosystemCasinoGames();
        detectValidationErrors(res);
        shouldGetAllEcosystemGames(res.data, expect);
    })); 

})

