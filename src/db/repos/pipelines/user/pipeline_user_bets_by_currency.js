import mongoose from 'mongoose';
import { pipeline_bets_by_currency, pipeline_user_by_bet, pipeline_user_by_game, pipeline_offset, pipeline_size } from '../filters';

const pipeline_user_bets_by_currency = (_id, {currency, bet, game, offset, size}) =>
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
        },
        ...pipeline_bets_by_currency({ currency }),
        ...pipeline_user_by_bet({ bet }),
        {
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
        },
        ...pipeline_user_by_game({ game }),
        {
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
        },
        ...pipeline_offset({ offset }),
        ...pipeline_size({ size })
    ]


export default pipeline_user_bets_by_currency;