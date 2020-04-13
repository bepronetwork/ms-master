import mongoose from 'mongoose';

const pipeline_user_by_bet = ({ bet }) => {
    if (!bet) { return {} };
    return [
        {
            '$match': {
              'bet._id': mongoose.Types.ObjectId(bet)
            }
          }
    ];
}


export {
    pipeline_user_by_bet
}