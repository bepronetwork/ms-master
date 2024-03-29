import mongoose from 'mongoose';
import { pipeline_bets_by_currency, pipeline_bets_by_date } from '../filters';


const pipeline_bets_stats = (_id, { currency, dates }) => 
    [
        //Stage 0
    {
        '$match' : {
            "_id" : mongoose.Types.ObjectId(_id)
        }
    },   {
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
        '$group': {
          '_id': {
            'day': {
              '$dayOfYear': '$bet.timestamp'
            }, 
            'year': {
              '$year': '$bet.timestamp'
            }
          }, 
          'averageBet': {
            '$avg': '$bet.betAmount'
          }, 
          'averageBetReturn': {
            '$avg': '$bet.winAmount'
          }, 
          'betsWon': {
            '$sum': {
              '$cond': {
                'if': {
                  '$eq': [
                    '$bet.isWon', true
                  ]
                }, 
                'then': 1, 
                'else': 0
              }
            }
          }, 
          'betsAmount': {
            '$sum': 1
          }
        }
      }, {
        '$project': {
          '_id': false, 
          'date': {
            'day': '$_id.day', 
            'year': '$_id.year'
          }, 
          'bets': {
            'avg_bet': '$averageBet', 
            'avg_bet_return': '$averageBetReturn', 
            'won': '$betsWon', 
            'percentage_won': {
              '$divide': [
                '$betsWon', '$betsAmount'
              ]
            }, 
            'bet_return_percentage': {
              '$divide': [
                '$averageBetReturn', '$averageBet'
              ]
            }, 
            'amount': '$betsAmount'
          }
        }
      }
]

export default pipeline_bets_stats;

