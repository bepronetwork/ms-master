const pipeline_esports_by_date = ({ from_date, to_date }) => {
    if ((!from_date) || (!to_date)) { return {} };
    return [
        {
            '$match': {
                'created_at': { '$gte': from_date, '$lte': to_date }
            }
        }
    ]
}


export {
    pipeline_esports_by_date
}