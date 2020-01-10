import chai from 'chai';
import models from '../../../models';
import { 
    addGame,
    getGames,
    editTableLimit,
    editGameEdge
} from '../../../methods';

import {
    shouldAddEcosystemGameEuropeanRoulette,
    shouldChangeGameTableLimitEuropeanRoulette,
    shouldChangeGameEdgeEuropeanRoulette
} from '../../output/AppTestMethod';
import { mochaAsync, detectValidationErrors } from '../../../utils';
import { getApp } from '../../../services';

const expect = chai.expect;

global.test.ECOSYSTEM_GAMES.forEach( async ga => {
    var app = global.test.app, ECOSYSTEM_GAMES, GAMES;

    
    before( async () =>  {
        app = global.test.app;
        ECOSYSTEM_GAMES = global.test.ECOSYSTEM_GAMES;
    });


    it(`${ga.metaName} should add ecosystem game`, mochaAsync(async () => {
        var game = ECOSYSTEM_GAMES.find( g => g.metaName == ga.metaName);
        let get_app_model = {
            game : game._id,
            app : app.id
        }

        let res = await addGame(get_app_model, app.bearerToken, {id : app.id});
        detectValidationErrors(res);
        shouldAddEcosystemGameEuropeanRoulette(res.data, expect);
    })); 

    it(`${ga.metaName} should change game Table Limit`, mochaAsync(async () => {
        GAMES = (await getApp({app})).data.message.games;
        var game = GAMES.find( g => g.metaName == ga.metaName);

        let postData = {
            app : app.id,
            game : game._id,
            tableLimit : 30
        }
        let res = await editTableLimit(postData, app.bearerToken, {id : app.id});
        shouldChangeGameTableLimitEuropeanRoulette(res.data, expect);
    })); 

    it(`${ga.metaName} should change game Edge`, mochaAsync(async () => {
        var game = GAMES.find( g => g.metaName == ga.metaName);

        let postData = {
            app : app.id,
            game : game._id,
            edge : 3
        }
        let res = await editGameEdge(postData, app.bearerToken, {id : app.id});
        let get_app_model = models.apps.get_app(app.id);
        let games_res = await getGames(get_app_model, app.bearerToken, {id : app.id});
        let new_edge = games_res.data.message[0].edge;
        expect(new_edge).to.equal(postData.edge);
        shouldChangeGameEdgeEuropeanRoulette(res.data, expect);
    }));
}); 
