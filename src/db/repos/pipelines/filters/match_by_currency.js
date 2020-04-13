import mongoose from 'mongoose';

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
    pipeline_match_by_currency
}



