import mongoose from 'mongoose';

//Need User
const pipeline_user_bets_all = (_id, { currency }) =>
    [
        {
            '$match': {
                '_id': mongoose.Types.ObjectId(_id)
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
                'as': 'bets'
            }
        }, {
            '$project': {
                'bet': {
                    '$arrayElemAt': [
                        '$bets', 0
                    ]
                },
                '_id': true
            }
        }, {
            '$lookup': {
                'from': 'games',
                'localField': 'bet.game',
                'foreignField': '_id',
                'as': 'games'
            }
        }, {
            '$unwind': {
                'path': '$games'
            }
        }, {
            '$lookup': {
                'from': 'currencies',
                'localField': 'bet.currency',
                'foreignField': '_id',
                'as': 'currency'
            }
        }, {
            '$unwind': {
                'path': '$currency'
            }
        }, {
            '$lookup': {
                'from': 'betresultspaces',
                'localField': 'bet.result',
                'foreignField': '_id',
                'as': 'bet_result_space'
            }
        }, {
            '$lookup': {
                'from': 'users',
                'localField': 'bet.user',
                'foreignField': '_id',
                'as': 'user'
            }
        }, {
            '$unwind': {
                'path': '$user'
            }
        }
    ]


export default pipeline_user_bets_all;