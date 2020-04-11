import mongoose from "mongoose";

export function usersFromAppFiltered({size, offset, app, user}){
    var limit, skip, user;

    if(offset != 0){
        size += offset;
        skip = {
            '$skip': offset
        };
    }

    if(size != 0){
        limit = {
            '$limit': size
        };
    };


    if(user){
        user = {
            '$match': {
                _id : mongoose.Types.ObjectId(user)
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
                app_id : mongoose.Types.ObjectId(app)
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
                'affiliate' : true,
                'wallet': true, 
                'register_timestamp': true, 
                'nationality': true, 
                'age': true, 
                'email': true, 
                'withdraws': true, 
                'deposits': true, 
                'bets': true
            }
        },{
            '$lookup': {
                'from': 'bets', 
                'localField': 'bets', 
                'foreignField': '_id', 
                'as': 'bets'
                }
        },{
            '$lookup': {
                'from': 'games', 
                'localField': 'bets.game', 
                'foreignField': '_id', 
                'as': 'games'
                }
        },{
            '$lookup': {
                'from': 'currencies', 
                'localField': 'bets.currency', 
                'foreignField': '_id', 
                'as': 'currency'
                }
        },
        
    ]   
            

    populate.push(user);
    populate.push(limit);
    populate.push(skip);
    populate.push(sort);
    populate = populate.concat(populate_end);
    populate = populate.filter(el => el != undefined);
    return populate;
}

