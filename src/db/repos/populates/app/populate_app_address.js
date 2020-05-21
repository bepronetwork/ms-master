import populate_wallet_all from "../wallet/all";

let populate_app_address = [
    {
        path : 'wallet',
        model : 'Wallet',
        select : { '__v': 0},
        populate : populate_wallet_all
    },
    {   
        path : 'availableDepositAddresses',
        select : { '__v': 0},
        populate : [
            {
                path : 'address',
                model : 'Address',
                select : { '__v': 0}
            },
            {
                path : 'user',
                model : 'User',
                select : { '__v': 0}
            }
        ]
    },
] 

export default populate_app_address;