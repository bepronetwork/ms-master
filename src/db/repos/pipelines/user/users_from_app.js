import mongoose from "mongoose";

export function usersFromAppFiltered({ size, offset, app, user, username, email }) {
    var limit, skip, user;

    if(offset != 0){
        skip = {
            '$skip': offset
        };
    }

    if (size != 0) {
        limit = {
            '$limit': size > 100 ? 100 : size
        };
    };


    if (user) {
        user = {
            '$match': {
                _id: mongoose.Types.ObjectId(user)
            }
        };
    }

    if (username) {
        username = {
            '$match': {
                'username': {
                    '$regex': username,
                    '$options': 'i'
                }
            }
        };
    }

    if (email) {
        email = {
            '$match': {
                'email': {
                    '$regex': email,
                    '$options': 'i'
                }
            }
        };
    }

    let sort = {
        '$sort': {
            'register_timestamp': -1
        }
    }

    let populate = [
        {
            '$match': {
                app_id: mongoose.Types.ObjectId(app)
            }
        }
    ]

    const populate_end =
        [
            {
                '$lookup': {
                    'from': 'wallets',
                    'localField': 'wallet',
                    'foreignField': '_id',
                    'as': 'wallet'
                }
            },
            {
                '$lookup': {
                    'from': 'affiliates',
                    'localField': 'affiliate',
                    'foreignField': '_id',
                    'as': 'affiliate'
                }
            },
            {
                '$lookup': {
                    'from': 'wallets',
                    'localField': 'affiliate.wallet',
                    'foreignField': '_id',
                    'as': 'affiliate.wallet'
                }
            }, {
                '$project': {
                    '_id': true,
                    'username': true,
                    'full_name': true,
                    'name': true,
                    'address': true,
                    'affiliate': true,
                    'wallet': true,
                    'register_timestamp': true,
                    'nationality': true,
                    'age': true,
                    'email': true,
                    'withdraws': true,
                    'deposits': true,
                    'bets': true,
                    'kyc_needed': true,
                    'kyc_status': true,
                    'isWithdrawing': true,
                }
            }
        ]


    populate.push(user);
    populate.push(username);
    populate.push(email);
    populate.push(skip);
    populate.push(limit);
    populate.push(sort);
    populate = populate.concat(populate_end);
    populate = populate.filter(el => el != undefined);
    return populate;
}

