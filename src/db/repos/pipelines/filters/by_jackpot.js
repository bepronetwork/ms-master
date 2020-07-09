import mongoose from 'mongoose';

const pipeline_jackpot = ({ jackpot }) => {
    if (!jackpot) { return {} };
    return [
        {
            '$match': {
                'isJackpot': jackpot
            }
        }
    ];
}

export {
    pipeline_jackpot
}