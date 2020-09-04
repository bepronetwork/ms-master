import mongoose from 'mongoose';
import { pipeline_match_by_currency, pipeline_by_timestamp } from '../filters';

const pipeline_user_stats = (_id, { dates, currency }) =>
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
				'from': 'users',
				'localField': 'user',
				'foreignField': '_id',
				'as': 'user'
			}
		}, {
			'$unwind': {
				'path': '$user'
			}
		}, {
			'$group': {
				'_id': {
					'user': '$user._id',
					'name': '$user.name',
					'email': '$user.email',
					'wallet': '$user.wallet'
				},
				'bets': {
					'$sum': 1
				},
				'betAmount': {
					'$sum': '$betAmount'
				},
				'winAmount': {
					'$sum': '$winAmount'
				}
			}
		}, {
			'$lookup': {
				'from': 'wallets',
				'localField': '_id.wallet',
				'foreignField': '_id',
				'as': 'wallet'
			}
		}, {
			'$project': {
				'_id': '$_id.user',
				'name': '$_id.name',
				'email': '$_id.email',
				'bets': '$bets',
				'betAmount': '$betAmount',
				'winAmount': '$winAmount',
				'profit': {
					'$subtract': [
						'$winAmount', '$betAmount'
					]
				},
				'playBalance': {
					'$arrayElemAt': [
						'$wallet.playBalance', 0
					]
				}
			}
		}
	]





export default pipeline_user_stats;