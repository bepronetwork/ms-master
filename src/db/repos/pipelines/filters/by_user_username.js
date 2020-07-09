import mongoose from 'mongoose';

const pipeline_user_username = ({ username }) => {
    if (!username) { return {} };
    return [
        {
            '$match': {
                'user.username': {
                    '$regex': username,
                    '$options': 'i'
                }
            }
        }
    ];
}

export {
    pipeline_user_username
}



