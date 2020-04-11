import mongoose from 'mongoose';

const pipeline_bets_by_currency = ({ currency }) => {
    if (!currency) { return {} };
    return [
        {
            '$match': {
                "bet.currency": mongoose.Types.ObjectId(currency)
            }
        }
    ];
}

const pipeline_match_by_currency = ({ currency }) => {
    if (!currency) { return {} };
    return [
        {
            '$match': {
                "currency": mongoose.Types.ObjectId(currency)
            }
        }
    ];
}

export {
    pipeline_bets_by_currency,
    pipeline_match_by_currency
}



