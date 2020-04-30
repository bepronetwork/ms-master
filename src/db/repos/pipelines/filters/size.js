import mongoose from 'mongoose';

const pipeline_size = ({ size }) => {
    if (!size) {
        return [
            {
                '$limit': 200
            }
        ];
    };
    return [
        {
            '$limit': size > 200 ? 200 : size
        }
    ];
}


export {
    pipeline_size
}