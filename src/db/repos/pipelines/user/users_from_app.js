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
                user : mongoose.Types.ObjectId(user)
            }
        };
    }

    let sort = {
        '$sort': {
            'playBalance': -1
        }
    }
    
    let populate = [
        {
            '$match': {
                app : mongoose.Types.ObjectId(app)
            }
        }
    ]

    populate.push(user);
    populate.push(limit);
    populate.push(skip);
    populate.push(sort);
    populate = populate.filter(el => el != undefined);
    return populate;
}

