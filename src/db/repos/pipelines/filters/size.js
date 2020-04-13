import mongoose from 'mongoose';

const pipeline_size = ({ size }) => {
    if (!size) {
        return [
            {
                '$limit': 100
            }
        ];
    };
    return [
        {
            '$limit': size
        }
    ];
}


export {
    pipeline_size
}