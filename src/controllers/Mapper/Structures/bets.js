
const bets_object = (object) => {
    return {
        "bets": object.bets ? object.bets.map(bet_id => {
            return ({
                "_id": bet_id
            })
        }) : object.bets,
    }
}


export {
    bets_object
}