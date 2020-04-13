import mongoose from 'mongoose';

const pipeline_app_user_by_game = ({ game }) => {
    if (!game) { return {} };
    return [
        {
            '$match': {
                'game._id': mongoose.Types.ObjectId(game)
            }
        }
    ];
}


export {
    pipeline_app_user_by_game
}