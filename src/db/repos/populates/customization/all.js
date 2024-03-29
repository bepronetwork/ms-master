
let populate_customization_all = [
    {
        path : 'topBar',
        model : 'TopBar',
        select : { '__v': 0},
        populate : [
            {
                path : 'languages.language',
                model : 'Language',
                select : { '__v': 0}
            },
        ]
    },
    {
        path : 'banners',
        model : 'Banners',
        select : { '__v': 0},
        populate : [
            {
                path : 'languages.language',
                model : 'Language',
                select : { '__v': 0}
            },
        ]
    },
    {
        path : 'socialLink',
        model : 'SocialLink',
        select : { '__v': 0},
    },
    {
        path : 'subSections',
        model : 'SubSections',
        select : { '__v': 0},
        populate : [
            {
                path : 'languages.language',
                model : 'Language',
                select : { '__v': 0}
            },
        ]
    },
    {
        path : 'icons',
        model : 'Icons',
        select : { '__v': 0},
    },
    {
        path : 'logo',
        model : 'Logo',
        select : { '__v': 0},
    },
    {
        path : 'background',
        model : 'Background',
        select : { '__v': 0},
    },
    {
        path : 'topIcon',
        model : 'TopIcon',
        select : { '__v': 0},
    },
    {
        path : 'topTab',
        model : 'TopTab',
        select : { '__v': 0},
        populate : [
            {
                path : 'languages.language',
                model : 'Language',
                select : { '__v': 0}
            },
        ]
    },
    {
        path : 'loadingGif',
        model : 'LoadingGif',
        select : { '__v': 0},
    },
    {
        path : 'skin',
        model : 'Skin',
        select : { '__v': 0},
    },
    {
        path : 'colors',
        model : 'Color',
        select : { '__v': 0},
    },
    {
        path : 'esportsScrenner',
        model : 'EsportsScrenner',
        select : { '__v': 0},
    },
    {
        path : 'languages',
        model : 'Language',
        select : { '__v': 0},
    },
    {
        path : 'footer',
        model : 'Footer',
        select : { '__v': 0},
        populate : [
            {
                path : 'languages.supportLinks',
                model : 'Link',
                select : { '__v': 0}
            },
            {
                path : 'languages.communityLinks',
                model : 'Link',
                select : { '__v': 0}
            },
            {
                path : 'languages.language',
                model : 'Language',
                select : { '__v': 0}
            }
        ]
    },
] 

export default populate_customization_all;