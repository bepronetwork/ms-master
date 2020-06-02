import { throwError } from "../../controllers/Errors/ErrorManager";

export function getGameProbablityNormalizer({metaName, probability}){
    console.log("probability", probability)
    let ret = probability;
    switch(metaName){
        case 'keno_simple' : {
            if(probability <= 0.0001){
                ret = 0.01;
                break;
            }
        }
    }
    return ret;
}