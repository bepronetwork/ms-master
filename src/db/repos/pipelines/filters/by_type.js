const pipeline_by_type = ({ type }) => {
    if (!type) { return {} };
    return [
        {
            '$match': {
                'type': type
            }
        }
    ]
}


export {
    pipeline_by_type
}