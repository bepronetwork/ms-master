import mongoose from 'mongoose';
import { pipeline_offset, pipeline_size, pipeline_match_by_currency, pipeline_esports_by_date, pipeline_by_videogame_slug, pipeline_by_type } from '../filters';


const pipeline_bets_esports = (_id, { size, dates, currency, type, offset, slug }) =>
    [
        {
            '$match': {
                'user': mongoose.Types.ObjectId(_id)
            }
        },
        ...pipeline_match_by_currency({ currency }),
        ...pipeline_esports_by_date({ from_date: dates.from, to_date: dates.to }),
        ...pipeline_by_type({ type }),
        {
            '$lookup': {
                'from': 'videogames',
                'localField': 'videogames',
                'foreignField': '_id',
                'as': 'videogames'
            }
        }, {
            '$unwind': {
                'path': '$videogames'
            }
        },
        ...pipeline_by_videogame_slug({ slug }),
        {
            '$sort': {
                'created_at': -1
            }
        },
        ...pipeline_offset({ offset }),
        ...pipeline_size({ size })
    ]


export default pipeline_bets_esports;