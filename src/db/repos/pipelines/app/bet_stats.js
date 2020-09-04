import mongoose from 'mongoose';
import { pipeline_match_by_currency, pipeline_by_timestamp } from '../filters';


const pipeline_bet_stats = (_id, { dates, currency }) =>
  [
    {
      '$match': {
        'app': mongoose.Types.ObjectId(_id)
      }
    },
    ...pipeline_match_by_currency({ currency }),
    ...pipeline_by_timestamp({ from_date: dates.from, to_date: dates.to }),
    {
      '$group': {
        '_id': {
          'week': {
            '$week': '$timestamp'
          },
          'year': {
            '$year': '$timestamp'
          }
        },
        'averageBet': {
          '$avg': '$betAmount'
        },
        'averageBetReturn': {
          '$avg': {
            '$subtract': [
              '$betAmount', '$winAmount'
            ]
          }
        },
        'betsWon': {
          '$sum': {
            '$cond': {
              'if': {
                '$eq': [
                  '$isWon', true
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
          'week': '$_id.week',
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
          'amount': '$betsAmount'
        }
      }
    }
  ]


export default pipeline_bet_stats;