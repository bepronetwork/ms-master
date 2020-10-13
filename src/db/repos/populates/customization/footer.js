
let populate_footer = [
    {
        path: 'languages.supportLinks',
        model: 'Link',
        select: { '__v': 0 }
    },
    {
        path: 'languages.communityLinks',
        model: 'Link',
        select: { '__v': 0 }
    },
    {
        path : 'languages.language',
        model : 'Language',
        select : { '__v': 0}
    }
]

export default populate_footer;