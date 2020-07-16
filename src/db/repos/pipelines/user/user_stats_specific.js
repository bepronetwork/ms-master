import mongoose from 'mongoose';

const pipeline_user_specific_stats = (_id, currency) =>
    [
        {
            '$match': {
                '_id': mongoose.Types.ObjectId(_id)
            }
        }, {
            '$lookup': {
                'from': 'bets',
                'localField': 'bets',
                'foreignField': '_id',
                'as': 'bets'
            }
        }, {
            '$unwind': {
                'path': '$bets'
            }
        }, {
            '$lookup': {
                'from': 'wallets',
                'localField': 'wallet',
                'foreignField': '_id',
                'as': 'wallet'
            }
        }, {
            '$unwind': {
                'path': '$wallet'
            }
        }, {
            '$match': {
                'wallet.currency': mongoose.Types.ObjectId(currency)
            }
        }, {
            '$group': {
                '_id': '$_id',
                'betAmount': {
                    '$sum': '$bets.betAmount'
                },
                'winAmount': {
                    '$sum': '$bets.winAmount'
                },
                'bets': {
                    '$sum': 1
                },
                'wallet': {
                    '$first': '$wallet'
                }
            }
        }, {
            '$project': {
                '_id': '$_id',
                'betAmount': '$betAmount',
                'winAmount': '$winAmount',
                'profit': {
                    '$subtract': [
                        '$winAmount', '$betAmount'
                    ]
                },
                'playBalance': '$wallet.playBalance',
                'currency': '$wallet.currency'
            }
        }
    ]


export default pipeline_user_specific_stats;


