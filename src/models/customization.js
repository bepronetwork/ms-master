import { CustomizationLogic } from '../logic';
import { CustomizationRepository } from '../db/repos';
import ModelComponent from './modelComponent';
import { TopBar, Banners, SubSections, Color, Logo, Footer, TopIcon, LoadingGif, Background, TopTab, Icons, EsportsScrenner, SocialLink } from '.';
import { colors } from '../mocks';
import Skin from './skin';
import Language from './language';

class Customization extends ModelComponent {

    constructor(params) {

        let db = new CustomizationRepository();

        super(
            {
                name: 'Customization',
                logic: new CustomizationLogic({ db: db }),
                db: db,
                self: null,
                params: { ...params, colors: colors },
                children: [
                    new TopBar(params),
                    new Banners(params),
                    new SubSections(params),
                    new Logo(params),
                    new Footer(params),
                    new TopIcon(params),
                    new LoadingGif(params),
                    new Skin(params),
                    new Background(params),
                    new EsportsScrenner(params),
                    new SocialLink(params),
                    new TopTab({
                        ids: [
                            {
                                name: "Casino",
                                icon: "https://i.ibb.co/h96g1bx/Casino.png",
                                link_url: "/"
                            }
                        ]
                    }),
                    new Icons({
                        ids: [
                            {
                                position: "0",
                                link: "0.png",
                                name: "test"
                            }
                        ]
                    }),
                ]
            }
        );
    }

    async register() {
        try {
            return await this.process('Register');
        } catch (err) {
            throw err;
        }
    }
}

export default Customization;