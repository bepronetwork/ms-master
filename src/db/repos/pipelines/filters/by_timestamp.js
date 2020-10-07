const pipeline_bets_by_timestamp = ({ begin_at, end_at }) => {
    if ((!begin_at) || (!end_at)) { return {} };
    return [
        {
            '$match': {
                'timestamp': { '$gte': new Date(begin_at), '$lte': new Date(end_at) }
            }
        }
    ]
}


export {
    pipeline_bets_by_timestamp
}



