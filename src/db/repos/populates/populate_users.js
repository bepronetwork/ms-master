import populate_integrations_all from "./integrations/all";
import populate_wallet_all from "./wallet/all";


let populate_users = [
    {
        path : 'wallet',
        model : 'Wallet',
        select : { '__v': 0},
        populate : populate_wallet_all
    },
    {
        path : 'affiliate',
        model : 'Affiliate',
        select : { '__v': 0},
        populate : [
            {
                path : 'wallet',
                model : 'Wallet',
                select : { '__v': 0},
                populate : populate_wallet_all
            }
        ]
    }
]

export default populate_users;