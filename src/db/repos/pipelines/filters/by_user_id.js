import mongoose from 'mongoose';

const pipeline_user_by_id = ({ user }) => {
    if (!user) { return {} };
    return [
          {
            '$match': {
              'user._id': mongoose.Types.ObjectId(user)
            }
          }
    ];
}


export {
    pipeline_user_by_id
}



