const pipeline_bets_by_timestamp = ({ begin_at, end_at }) => {
    if ((!begin_at) || (!end_at)) { return {} };
    return [
        {
            '$match': {
                'timestamp': { '$gte': begin_at, '$lte': end_at }
            }
        }
    ]
}


export {
    pipeline_bets_by_timestamp
}



