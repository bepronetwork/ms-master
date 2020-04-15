import mongoose from 'mongoose';

const pipeline_bets_by_currency_id = ({ currency }) => {
    if (!currency) { return {} };
    return [
        {
            '$match': {
                "bets.currency": mongoose.Types.ObjectId(currency)
            }
        }
    ];
}

export {
    pipeline_bets_by_currency_id
}



