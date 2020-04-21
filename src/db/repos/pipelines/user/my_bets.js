import mongoose from 'mongoose';
import { pipeline_bets_by_currency, pipeline_bets_by_date, pipeline_match_by_game, pipeline_offset, pipeline_size } from '../filters';


const pipeline_my_bets = (_id, { dates, currency, game, offset, size }) => 
    [
        //Stage 0
    {
        '$match' : {
            "_id" : mongoose.Types.ObjectId(_id)
        }
    },
    {
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
    },
    ...pipeline_bets_by_currency({currency}) 
    ,
    ...pipeline_bets_by_date({from_date : dates.from, to_date : dates.to})    
    ,
    {
        '$lookup': {
        'from': 'games', 
        'localField': 'bet.game', 
        'foreignField': '_id', 
        'as': 'bet.game'
        }
    }, {
        '$project': {
        'bet': true, 
        'game': {
            '$arrayElemAt': [
            '$bet.game', 0
            ]
        }
        }
    },
    {
        '$project': {
            '_id': '$bet._id', 
            'betAmount': '$bet.betAmount', 
            'timestamp': '$bet.timestamp', 
            'isWon': '$bet.isWon', 
            'winAmount': '$bet.winAmount',
            'currency': '$bet.currency',
            'game': '$game._id'
        }
    },
    ...pipeline_match_by_game({ game }),
    {
        '$sort': {
            'timestamp': -1
        }
    },
    ...pipeline_offset({ offset }),
    ...pipeline_size({ size })
]


export default pipeline_my_bets;