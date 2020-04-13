import mongoose from 'mongoose';

const pipeline_app_user_by_bet = ({ bet }) => {
    if (!bet) { return {} };
    return [
        {
            '$match': {
              'bets._id': mongoose.Types.ObjectId(bet)
            }
          }
    ];
}


export {
    pipeline_app_user_by_bet
}