import mongoose from 'mongoose';
import { pipeline_match_by_currency, pipeline_by_timestamp } from '../filters';


const pipeline_revenue_stats = (_id, { dates, currency }) =>
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
          'hour': {
            '$hour': '$timestamp'
          },
          'day': {
            '$dayOfYear': '$timestamp'
          },
          'year': {
            '$year': '$timestamp'
          }
        },
        'lossAmount': {
          '$sum': '$winAmount'
        },
        'revenueAmount': {
          '$sum': '$betAmount'
        },
        'betsAmount': {
          '$sum': 1
        },
        'fees': {
          '$sum': '$fee'
        }
      }
    }, {
      '$addFields': {
        'profitAmount': {
          '$subtract': [
            '$revenueAmount', '$lossAmount'
          ]
        }
      }
    }, {
      '$project': {
        '_id': false,
        'date': {
          'hour': '$_id.hour',
          'day': '$_id.day',
          'year': '$_id.year'
        },
        'financials': {
          'loss': '$lossAmount',
          'bets': '$betsAmount',
          'revenue': '$revenueAmount',
          'totalProfit': '$profitAmount',
          'feeProfit': '$fees',
          'gambleProfit': {
            '$subtract': [
              '$profitAmount', '$fees'
            ]
          }
        }
      }
    }
  ]

export default pipeline_revenue_stats;