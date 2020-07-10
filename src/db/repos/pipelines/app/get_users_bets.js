import mongoose from 'mongoose';
import {
    pipeline_offset,
    pipeline_size,
    pipeline_user_username,
    pipeline_match_by_currency,
    pipeline_match_by_game,
    pipeline_user,
    pipeline_id,
    pipeline_jackpot
} from '../filters';


const pipeline_get_users_bets = ({ app, _id, game, currency, jackpot, user, username, offset, size }) =>
    [
        {
            '$match': {
                'app': mongoose.Types.ObjectId(app)
            }
        },
        ...pipeline_id({ _id }),
        ...pipeline_match_by_game({ game }),
        ...pipeline_match_by_currency({ currency }),
        ...pipeline_jackpot({ jackpot }),
        ...pipeline_user({ user }),
        {
            '$lookup': {
                'from': 'users',
                'localField': 'user',
                'foreignField': '_id',
                'as': 'user'
            }
        }, {
            '$unwind': {
                'path': '$user'
            }
        },
        ...pipeline_user_username({ username }),
        {
            '$sort': {
                'timestamp': -1
            }
        },
        ...pipeline_offset({ offset }),
        ...pipeline_size({ size })
    ]

export default pipeline_get_users_bets;