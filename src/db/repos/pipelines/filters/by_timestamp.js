const pipeline_by_timestamp = ({ from_date, to_date }) => {
    if ((!from_date) || (!to_date)) { return {} };
    return [
        {
            '$match': {
                'timestamp': { '$gte': from_date, '$lte': to_date }
            }
        }
    ]
}


export {
    pipeline_by_timestamp
}



