import mongoose from 'mongoose';

const pipeline_user = ({ user }) => {
    if (!user) { return {} };
    return [
        {
            '$match': {
                'user': mongoose.Types.ObjectId(user)
            }
        }
    ];
}

export {
    pipeline_user
}