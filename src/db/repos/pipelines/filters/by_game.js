import mongoose from 'mongoose';

const pipeline_match_by_game = ({ game }) => {
    if (!game) { return {} };
    return [
        {
            '$match': {
                "game": mongoose.Types.ObjectId(game)
            }
        }
    ];
}

export {
    pipeline_match_by_game
}