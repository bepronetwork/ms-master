import populate_integrations_all from "./integrations/all";
import populate_wallet_all from "./wallet/all";


let populate_user = [
    {
        path : 'security',
        model : 'Security',
        select : { '__v': 0},
    },
    {
        path : 'wallet',
        model : 'Wallet',
        select : { '__v': 0},
        populate : populate_wallet_all
    },
    {
        path : 'app_id',
        model : 'App',
        select : { '__v': 0},
        populate : [
            {
                path : 'wallet',
                model : 'Wallet',
                select : { '__v': 0},
                populate : populate_wallet_all
            },
            {
                path : 'integrations',
                model : 'Integrations',
                select : { '__v': 0},
                populate : populate_integrations_all
            },
        ]
    },
    {
        path : 'withdraws',
        model : 'Withdraw',
        select : { '__v': 0}
    },
    {
        path : 'deposits',
        model : 'Deposit',
        select : { '__v': 0}
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
    },
    {
        path : 'affiliateLink',
        model : 'AffiliateLink',
        select : { '__v': 0},
        populate : [
            {
                path : 'parentAffiliatedLinks',
                model : 'AffiliateLink',
                select : { '__v': 0},
                populate : [
                    {
                        path : 'affiliateStructure',
                        model : 'AffiliateStructure',
                        select : { '__v': 0}
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
            },
            {
                path : 'affiliateStructure',
                model : 'AffiliateStructure',
                select : { '__v': 0}
            },
        ]
    },
] 

export default populate_user;