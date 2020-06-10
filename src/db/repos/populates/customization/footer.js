
let populate_footer = [
    {
        path: 'supportLinks',
        model: 'Link',
        select: { '__v': 0 }
    },
    {
        path: 'communityLinks',
        model: 'Link',
        select: { '__v': 0 }
    },
]

export default populate_footer;