const pipeline_by_videogame_slug = ({ slug }) => {
    if (!slug) { return {} };
    return [
        {
            '$match': {
                'videogames': {
                    '$elemMatch': {
                        'slug': slug
                    }
                }
            }
        }
    ]
}


export {
    pipeline_by_videogame_slug
}