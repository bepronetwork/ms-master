
const games_object = (object) => {
    return {
        "games": object.games ? object.games.map(game => {
            return ({
                "_id": game._id,
                "result": game.result ? game.result.map(result_id => {
                    return ({
                        "_id": result_id
                    })
                }) : game.result,
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