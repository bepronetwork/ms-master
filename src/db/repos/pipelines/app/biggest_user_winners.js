import mongoose from 'mongoose';
import { pipeline_match_by_currency, pipeline_match_by_game, pipeline_offset, pipeline_size } from '../filters';


const pipeline_biggest_user_winners = (_id, { currency, game, offset, size }) =>
  [
    {
      '$match': {
        '_id': mongoose.Types.ObjectId(_id)
      }
    }, {
      '$lookup': {
        'from': 'games',
        'localField': 'games',
        'foreignField': '_id',
        'as': 'games'
      }
    }, {
      '$project': {
        'games.bets': true,
        '_id': false
      }
    }, {
      '$unwind': {
        'path': '$games'
      }
    }, {
      '$project': {
        'bets': '$games.bets'
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
    }, {
      '$lookup': {
        'from': 'users',
        'localField': 'bet.user',
        'foreignField': '_id',
        'as': 'bet.user'
      }
    }, {
      '$lookup': {
        'from': 'games',
        'localField': 'bet.game',
        'foreignField': '_id',
        'as': 'bet.game'
      }
    }, {
      '$project': {
        'bet': true,
        'user': {
          '$arrayElemAt': [
            '$bet.user', 0
          ]
        },
        'game': {
          '$arrayElemAt': [
            '$bet.game', 0
          ]
        }
      }
    }, {
      '$project': {
        '_id': '$bet._id',
        'betAmount': '$bet.betAmount',
        'currency': '$bet.currency',
        'timestamp': '$bet.timestamp',
        'isWon': '$bet.isWon',
        'winAmount': '$bet.winAmount',
        'username': '$user.username',
        'game': '$game._id'
      }
    },
    ...pipeline_match_by_currency({ currency }),
    ...pipeline_match_by_game({ game }),
    {
      '$group': {
        '_id': '$username',
        'winAmount': {
          '$sum': '$winAmount'
        }
      }
    }, {
      '$sort': {
        'winAmount': -1
      }
    },
    ...pipeline_offset({ offset }),
    ...pipeline_size({ size })
  ]


export default pipeline_biggest_user_winners;