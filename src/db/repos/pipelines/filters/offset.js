import mongoose from 'mongoose';

const pipeline_offset = ({ offset }) => {
    if (!offset) {
        return [
            {
                '$skip': 0
            }
        ];
    };
    return [
        {
            '$skip': offset
        }
    ];
}


export {
    pipeline_offset
}