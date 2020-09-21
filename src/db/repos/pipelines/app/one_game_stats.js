import mongoose from 'mongoose';
const pipeline_one_game_stats = (_id, { currency, game }) => 
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
        'games.name': true, 
        'games.edge': true, 
        'games.description': true, 
        'games._id': true, 
        'games.wallets': true
      }
    }, {
      '$unwind': {
        'path': '$games'
      }
    }, {
      '$match': {
        'games._id': mongoose.Types.ObjectId(game)
      }
    }, {
      '$project': {
        'bets': '$games.bets', 
        'wallets': '$games.wallets', 
        'name': '$games.name', 
        'edge': '$games.edge', 
        'game_id': '$games._id'
      }
    }, {
      '$unwind': {
        'path': '$bets', 
        'preserveNullAndEmptyArrays': true
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
        }, 
        'game': {
          'wallets': '$wallets', 
          'name': '$name', 
          'edge': '$edge', 
          '_id': '$game_id'
        }
      }
    }, {
      '$match': {
        'bet.currency': mongoose.Types.ObjectId(currency)
      }
    }, {
      '$group': {
        '_id': {
          '_id': '$game._id', 
          'game': '$bet.game', 
          'name': '$game.name'
        }, 
        'betAmount': {
          '$sum': '$bet.betAmount'
        }, 
        'betsAmount': {
          '$sum': 1
        }, 
        'paidAmount': {
          '$sum': '$bet.winAmount'
        }, 
        'fees': {
          '$sum': '$bet.fee'
        }, 
        'edge': {
          '$first': '$game.edge'
        }, 
        'wallets': {
          '$first': '$game.wallets'
        }
      }
    }, {
      '$group': {
        '_id': {
          'month': '$_id.month', 
          'year': '$_id.year'
        }, 
        'game': {
          '$push': {
            '_id': '$_id._id', 
            'name': '$_id.name', 
            'edge': '$edge', 
            'betsAmount': '$betAmount', 
            'betAmount': '$betsAmount', 
            'limitTable': '$wallets', 
            'profit': {
              '$subtract': [
                '$betAmount', '$paidAmount'
              ]
            }, 
            'fees': '$fees'
          }
        }
      }
    }, {
      '$unwind': {
        'path': '$game', 
        'preserveNullAndEmptyArrays': true
      }
    }
]

export default pipeline_one_game_stats;

