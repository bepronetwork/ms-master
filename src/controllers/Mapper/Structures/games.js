
const games_object = (object) => {
    return {
        "games": object.games ? object.games.map(game => {
            return ({
                "_id": game._id,
                "resultSpace": !game.resultSpace ? [] : game.resultSpace.map(result_space => {
                    return ({
                        "_id": result_space._id,
                        "formType": result_space.formType,
                        "probability": result_space.probability,
                        "multiplier": result_space.multiplier,
                    })
                }),
                "result": game.result ? game.result.map(result_id => {
                    return ({
                        "_id": result_id
                    })
                }) : game.result,
                "bets": game.bets ? game.bets.map(bet_id => {
                    return ({
                        "_id": bet_id
                    })
                }) : game.bets,
                "isClosed": game.isClosed,
                "maxBet": game.maxBet,
                "background_url": game.background_url,
                "name": game.name,
                "edge": game.edge,
                "app": game.app,
                "betSystem": game.betSystem,
                "timestamp": game.isClosed,
                "image_url": game.image_url,
                "metaName": game.metaName,
                "rules": game.rules,
                "description": game.description,
                "wallets": game.wallets ? game.wallets.map(wallet => {
                    return ({
                        "_id": wallet._id,
                        "tableLimit": wallet.tableLimit,
                    })
                }) : game.wallets,
            })
        }) : object.games,
    }
}


export {
    games_object
}