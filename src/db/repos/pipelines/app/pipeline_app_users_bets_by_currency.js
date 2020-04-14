import mongoose from 'mongoose';
import { pipeline_bets_by_currency_id, pipeline_user_by_id, pipeline_offset, pipeline_size, pipeline_app_user_by_bet, pipeline_app_user_by_game } from '../filters';

const pipeline_app_users_bets_by_currency = (_id, {currency, user, bet, game, offset, size} ) =>
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
        },
        ...pipeline_user_by_id({user}), 
        {
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
        },
        ...pipeline_app_user_by_bet({bet}),
        ...pipeline_bets_by_currency_id({currency}),
        {
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
        },
        ...pipeline_app_user_by_game({ game }),
        ...pipeline_offset({ offset }),
        ...pipeline_size({ size })
    ]


export default pipeline_app_users_bets_by_currency;