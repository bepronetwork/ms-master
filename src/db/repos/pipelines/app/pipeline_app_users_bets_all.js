import mongoose from 'mongoose';


const pipeline_app_users_bets_all = (_id, { currency }) =>
    [
        {
            '$match': {
                '_id': mongoose.Types.ObjectId(_id)
            }
        }, {
            '$project': {
                'app_id': '$_id',
                'users': '$users',
                '_id': false
            }
        }, {
            '$lookup': {
                'from': 'users',
                'localField': 'users',
                'foreignField': '_id',
                'as': 'user'
            }
        }, {
            '$project': {
                'app_id': true,
                'user': '$user'
            }
        }, {
            '$unwind': {
                'path': '$user'
            }
        }, {
            '$lookup': {
                'from': 'bets',
                'localField': 'user.bets',
                'foreignField': '_id',
                'as': 'bets'
            }
        }, {
            '$unwind': {
                'path': '$bets'
            }
        }, {
            '$lookup': {
                'from': 'betresultspaces',
                'localField': 'bets.result',
                'foreignField': '_id',
                'as': 'bet_result_space'
            }
        }, {
            '$lookup': {
                'from': 'currencies',
                'localField': 'bets.currency',
                'foreignField': '_id',
                'as': 'currency'
            }
        }, {
            '$unwind': {
                'path': '$currency'
            }
        }, {
            '$lookup': {
                'from': 'games',
                'localField': 'bets.game',
                'foreignField': '_id',
                'as': 'game'
            }
        }, {
            '$unwind': {
                'path': '$game'
            }
        }
    ]


export default pipeline_app_users_bets_all;
