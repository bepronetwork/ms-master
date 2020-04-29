const populate_jackpot = [
    {
        path : 'addOn',
        model : 'AddOn',
        select : { '__v': 0},
        populate : [
            {
                path : 'jackpot',
                model : 'Jackpot',
                select : { '__v': 0}
            }
        ]
    }
];

export default populate_jackpot;