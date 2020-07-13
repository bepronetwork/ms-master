import mongoose from 'mongoose';

const pipeline_id = ({ _id }) => {
    if (!_id) { return {} };
    return [
        {
            '$match': {
                '_id': mongoose.Types.ObjectId(_id)
            }
        }
    ];
}

export {
    pipeline_id
}