import mongoose from 'mongoose';
import { pipeline_bets_by_timestamp, pipeline_id, pipeline_offset, pipeline_size } from '../filters';


const pipeline_users_deposits = ({ app, size, begin_at, end_at, offset, user }) =>
    [
        {
            '$match': {
                'app_id': mongoose.Types.ObjectId(app)
            }
        },
        ...pipeline_id({ _id: user }),
        {
            '$lookup': {
                'from': 'deposits',
                'localField': 'deposits',
                'foreignField': '_id',
                'as': 'deposits'
            }
        }, {
            '$unwind': {
                'path': '$deposits'
            }
        }, {
            '$project': {
                '_id': '$deposits._id',
                'confirmations': '$deposits.confirmations',
                'maxConfirmations': '$deposits.maxConfirmations',
                'confirmed': '$deposits.confirmed',
                'link_url': '$deposits.link_url',
                'isPurchase': '$deposits.isPurchase',
                'purchaseAmount': '$deposits.purchaseAmount',
                'hasBonus': '$deposits.hasBonus',
                'bonusAmount': '$deposits.bonusAmount',
                'user': '$deposits.user',
                'timestamp': '$deposits.creation_timestamp',
                'last_update_timestamp': '$deposits.last_update_timestamp',
                'address': '$deposits.address',
                'currency': '$deposits.currency',
                'transactionHash': '$deposits.transactionHash',
                'amount': '$deposits.amount',
                'fee': '$deposits.fee'
            }
        },
        ...pipeline_bets_by_timestamp({ begin_at, end_at }),
        {
            '$sort': {
                'timestamp': -1
            }
        },
        ...pipeline_offset({ offset }),
        ...pipeline_size({ size })
    ]


export default pipeline_users_deposits;