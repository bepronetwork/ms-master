export function getGameProbablityNormalizer({metaName, probability}){
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