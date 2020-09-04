import mongoose from 'mongoose';
import { pipeline_match_by_currency, pipeline_by_timestamp } from '../filters';


const pipeline_game_stats = (_id, { dates, currency }) =>
    [
        {
            '$match': {
                'app': mongoose.Types.ObjectId(_id)
            }
        },
        ...pipeline_match_by_currency({ currency }),
        ...pipeline_by_timestamp({ from_date: dates.from, to_date: dates.to }),
        {
            '$lookup': {
                'from': 'games',
                'localField': 'game',
                'foreignField': '_id',
                'as': 'game'
            }
        }, {
            '$unwind': {
                'path': '$game'
            }
        }, {
            '$group': {
                '_id': {
                    '_id': '$game._id',
                    'month': {
                        '$month': '$timestamp'
                    },
                    'year': {
                        '$year': '$timestamp'
                    },
                    'game': '$game',
                    'name': '$game.name'
                },
                'betAmount': {
                    '$sum': '$betAmount'
                },
                'betsAmount': {
                    '$sum': 1
                },
                'paidAmount': {
                    '$sum': '$winAmount'
                },
                'fees': {
                    '$sum': '$fee'
                },
                'edge': {
                    '$first': '$game.edge'
                }
            }
        }, {
            '$group': {
                '_id': {
                    'month': '$_id.month',
                    'year': '$_id.year'
                },
                'games': {
                    '$push': {
                        '_id': '$_id._id',
                        'name': '$_id.name',
                        'edge': '$_id.edge',
                        'betsAmount': '$betAmount',
                        'betAmount': '$betsAmount',
                        'profit': {
                            '$subtract': [
                                '$betAmount', '$paidAmount'
                            ]
                        },
                        'fees': '$fees',
                        'edge': '$edge'
                    }
                }
            }
        }, {
            '$project': {
                '_id': false,
                'date': {
                    'month': '$_id.month',
                    'year': '$_id.year'
                },
                'games': '$games'
            }
        }
    ]

export default pipeline_game_stats;