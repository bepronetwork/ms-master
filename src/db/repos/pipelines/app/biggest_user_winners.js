import mongoose from 'mongoose';


const pipeline_biggest_user_winners_by_currency = (_id, { currency }) =>
    [
        {
            '$match': {
                '_id': mongoose.Types.ObjectId(_id)
            }
        }, {
            '$lookup': {
                'from': 'games',
                'localField': 'games',
                'foreignField': '_id',
                'as': 'games'
            }
        }, {
            '$project': {
                'games.bets': true,
                '_id': false
            }
        }, {
            '$unwind': {
                'path': '$games'
            }
        }, {
            '$project': {
                'bets': '$games.bets'
            }
        }, {
            '$unwind': {
                'path': '$bets'
            }
        }, {
            '$lookup': {
                'from': 'bets',
                'localField': 'bets',
                'foreignField': '_id',
                'as': 'bet'
            }
        }, {
            '$project': {
                'bet': {
                    '$arrayElemAt': [
                        '$bet', 0
                    ]
                }
            }
        }, {
            '$lookup': {
                'from': 'users',
                'localField': 'bet.user',
                'foreignField': '_id',
                'as': 'bet.user'
            }
        }, {
            '$lookup': {
                'from': 'games',
                'localField': 'bet.game',
                'foreignField': '_id',
                'as': 'bet.game'
            }
        }, {
            '$project': {
                'bet': true,
                'user': {
                    '$arrayElemAt': [
                        '$bet.user', 0
                    ]
                },
                'game': {
                    '$arrayElemAt': [
                        '$bet.game', 0
                    ]
                }
            }
        }, {
            '$project': {
                '_id': '$bet._id',
                'betAmount': '$bet.betAmount',
                'currency': '$bet.currency',
                'timestamp': '$bet.timestamp',
                'isWon': '$bet.isWon',
                'winAmount': '$bet.winAmount',
                'username': '$user.username',
                'game': '$game.name'
            }
        },
        ...pipeline_match_by_currency({ currency }),
        {
            '$group': {
                '_id': '$game',
                'winAmount': {
                    '$sum': '$winAmount'
                },
                'currency': {
                    '$first': '$currency'
                },
                'user': {
                    '$first': '$username'
                }
            }
        }, {
            '$sort': {
                'winAmount': -1
            }
        }, {
            '$limit': 100
        }, {
            '$project': {
                'currency': '$currency',
                'winAmount': '$winAmount',
                'username': '$user',
                'game': '$_id'
            }
        }
    ]


const pipeline_biggest_user_winners_all_currency = (_id, { currency }) =>
    [
        {
            '$match': {
                '_id': mongoose.Types.ObjectId(_id)
            }
        }, {
            '$lookup': {
                'from': 'games',
                'localField': 'games',
                'foreignField': '_id',
                'as': 'games'
            }
        }, {
            '$project': {
                'games.bets': true,
                '_id': false
            }
        }, {
            '$unwind': {
                'path': '$games'
            }
        }, {
            '$project': {
                'bets': '$games.bets'
            }
        }, {
            '$unwind': {
                'path': '$bets'
            }
        }, {
            '$lookup': {
                'from': 'bets',
                'localField': 'bets',
                'foreignField': '_id',
                'as': 'bet'
            }
        }, {
            '$project': {
                'bet': {
                    '$arrayElemAt': [
                        '$bet', 0
                    ]
                }
            }
        }, {
            '$lookup': {
                'from': 'users',
                'localField': 'bet.user',
                'foreignField': '_id',
                'as': 'bet.user'
            }
        }, {
            '$lookup': {
                'from': 'games',
                'localField': 'bet.game',
                'foreignField': '_id',
                'as': 'bet.game'
            }
        }, {
            '$project': {
                'bet': true,
                'user': {
                    '$arrayElemAt': [
                        '$bet.user', 0
                    ]
                },
                'game': {
                    '$arrayElemAt': [
                        '$bet.game', 0
                    ]
                }
            }
        }, {
            '$project': {
                '_id': '$bet._id',
                'betAmount': '$bet.betAmount',
                'currency': '$bet.currency',
                'timestamp': '$bet.timestamp',
                'isWon': '$bet.isWon',
                'winAmount': '$bet.winAmount',
                'username': '$user.username',
                'game': '$game.name'
            }
        },
        ...pipeline_match_by_currency({ currency }),
        {
            '$group': {
                '_id': '$game',
                'winAmount': {
                    '$sum': '$winAmount'
                },
                'currency': {
                    '$first': '$currency'
                },
                'user': {
                    '$first': '$username'
                }
            }
        }, {
            '$sort': {
                'winAmount': -1
            }
        }, {
            '$limit': 100
        }, {
            '$project': {
                'currency': '$currency',
                'winAmount': '$winAmount',
                'username': '$user',
                'game': '$_id'
            }
        }
    ]


export{
    pipeline_biggest_user_winners_by_currency,
    pipeline_biggest_user_winners_all_currency
} 