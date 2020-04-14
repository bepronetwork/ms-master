import mongoose from 'mongoose';

const pipeline_user_by_game = ({ game }) => {
    if (!game) { return {} };
    return [
        {
            '$match': {
              'games._id': mongoose.Types.ObjectId(game)
            }
          }
    ];
}


export {
    pipeline_user_by_game
}