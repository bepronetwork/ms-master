import { CustomizationLogic } from '../logic';
import { CustomizationRepository } from '../db/repos';
import ModelComponent from './modelComponent';
import { TopBar, Banners, Color, Logo, Footer, TopIcon, LoadingGif, Background, TopTabCassino, TopTabEsports } from '.';
import { colors } from '../mocks';
import TopTabEsports from './topTabEsports';

class Customization extends ModelComponent{

    constructor(params){

        let db = new CustomizationRepository();

        super(
            {
                name : 'Customization', 
                logic : new CustomizationLogic({db : db}), 
                db : db,
                self : null, 
                params : {...params, colors : colors},
                children : [
                    new TopBar(params),
                    new Banners(params),
                    new Logo(params),
                    new Footer(params),
                    new TopIcon(params),
                    new LoadingGif(params),
                    new Background(params),
                    new TopTabCassino(params),
                    new TopTabEsports(params),
                ]
            }
            );
    }

    async register(){
        try{
            return await this.process('Register');
        }catch(err){
            throw err;
        }
    }
}

export default Customization;