import MathSingleton from "./math";
import { throwError } from "../../controllers/Errors/ErrorManager";

function findWithAttr(array, attr, value) {
    for(var i = 0; i < array.length; i += 1) {
        if(array[i][attr] === value) {
            return i;
        }
    }
    return -1;
}

class CasinoLogic{

    constructor(){}

    /**
     * @function
     * @param {*} outcome 
     * @param {*} resultSpace 
     * 
     */

    fromOutcometoResultSpace(outcome, resultSpace){
        let currentSpace = 0;
        let res;
        let resultSpaceArray = resultSpace.map( (item, index) => {
            let spaces = item.probability*100;
            let nextSpace = currentSpace+spaces;
            let res = {
                key     : item.formType,
                start   : parseFloat(currentSpace),
                end     : parseFloat(nextSpace),
                probability : item.probability,
                index 
            }
            currentSpace = nextSpace;
            return res;
        })
        resultSpaceArray.map( (item) => {
            if(outcome >= item.start && outcome < item.end){
                res = item;
            }
        })

        return res;
    }
    
    /**
     * 
     * @param {Int} outcomeSpaceResult 
     * @param {fromOutcometoResultSpace} userResultSpace 
     */

    isWon(outcomeSpaceResult, userResultSpace){
        let unit =  userResultSpace.reduce( (acc, resultBetted) => {
            return parseInt(outcomeSpaceResult.index) == parseInt(resultBetted.place) ? acc+1 : acc;
        }, 0)

        return unit >= 1 ? true : false;
    }

    /**
     * 
     * @param {Float} betAmount 
     * @param {Int} houseEdge 
     */

    getRealOdd(betAmount, houseEdge=0){
        return MathSingleton.multiplyAbsolutes(betAmount, parseFloat(houseEdge))/100;
    }


    normalizeBet(userResultSpace, resultSpace){
        try{
            var placesFilled = [];
            /* Remove Duplicated Values from Odd Calculation */
            return userResultSpace.reduce( (array , item) => {
                if(placesFilled.findIndex( p => p == item.place) > -1){ throwError('BAD_BET')};
                placesFilled.push(item.place);
                if((item.place < 0) || (item.place >= resultSpace.length)){ throwError('BAD_BET')}
                if (findWithAttr(array, 'place', item.place) < 0 ){
                    if(typeof item.value != 'number'){throwError('BAD_BET')}
                    if(item.value <= 0){ throwError('BAD_BET')}
                    array.push({
                        place : item.place,
                        value : parseFloat(item.value)
                    });
                } 
                return array;
            },[]);
        }catch(err){
            throw err;
        }
            
    }

    /**
     * 
     * @param {Float} betAmount 
     * @param {Float} odd 
     * @param {Int} houseEdge 
     */

    calculateWinAmountWithOutcome({userResultSpace, resultSpace, houseEdge, outcomeResultSpace, game, totalBetAmount, jackpotAmount}){
        try{
            var winAmount, isWon, maxWin;

            switch(game){
                case 'european_roulette_simple' : {
                    var el = userResultSpace.find( object => parseInt(object.place) == parseInt(outcomeResultSpace.key));
                    if(!el){
                        // Lost
                        isWon = false;
                        winAmount = 0
                    }else{
                        // Win
                        isWon = true;
                        let probability = resultSpace[el.place].probability;
                        maxWin = parseFloat(el.value)/parseFloat(probability);
                        let houseEdgeBalance = this.getRealOdd(maxWin, houseEdge);
                        /* Default Logic */
                        winAmount = parseFloat(maxWin - houseEdgeBalance - jackpotAmount);
                    }   
                    break;
                };
                case 'wheel_simple' : {
                    var el = outcomeResultSpace;
                    let multiplier = resultSpace[el.key].multiplier;
                    maxWin = parseFloat(totalBetAmount)*parseFloat(multiplier);
                    /* Default Logic */
                    if(maxWin == 0){
                        // Lost
                        isWon = false;
                        winAmount = 0;
                    }else{
                        // Won
                        isWon = true;
                        let houseEdgeBalance = this.getRealOdd(maxWin, houseEdge);
                        winAmount = parseFloat(maxWin - houseEdgeBalance - jackpotAmount);
                    }
                    break;
                };
                case 'wheel_variation_1' : {
                    var el = outcomeResultSpace;
                    let multiplier = resultSpace[el.key].multiplier;
                    maxWin = parseFloat(totalBetAmount)*parseFloat(multiplier);
                    /* Default Logic */
                    if(maxWin == 0){
                        // Lost
                        isWon = false;
                        winAmount = 0;
                    }else{
                        // Won
                        isWon = true;
                        let houseEdgeBalance = this.getRealOdd(maxWin, houseEdge);
                        winAmount = parseFloat(maxWin - houseEdgeBalance - jackpotAmount);
                    }
                    break;
                };
                case 'plinko_variation_1' : {
                    var el = outcomeResultSpace;
                    let multiplier = resultSpace[el.key].multiplier;
                    maxWin = parseFloat(totalBetAmount)*parseFloat(multiplier);
                    /* Default Logic */
                    if(maxWin == 0){
                        // Lost
                        isWon = false;
                        winAmount = 0;
                    }else{
                        // Won
                        isWon = true;
                        let houseEdgeBalance = this.getRealOdd(maxWin, houseEdge);
                        winAmount = parseFloat(maxWin - houseEdgeBalance - jackpotAmount);
                    }
                    break;
                };
                case 'coinflip_simple' : {
                    var el = userResultSpace.find( object => parseInt(object.place) == parseInt(outcomeResultSpace.index));
                    if(!el){
                        // Lost
                        winAmount = 0
                        isWon = false;
                    }else{
                        isWon = true;
                        let probability = resultSpace[el.place].probability;
                        maxWin = parseFloat(totalBetAmount)/parseFloat(probability);
                        /* Default Logic */
                        let houseEdgeBalance = this.getRealOdd(maxWin, houseEdge);
                        console.log("maxWin", winAmount, maxWin, houseEdgeBalance, jackpotAmount)

                        winAmount = parseFloat(maxWin - houseEdgeBalance - jackpotAmount);
                    }   
                    break;
                };
                case 'linear_dice_simple' : {
                    var el = userResultSpace.find( object => parseInt(object.place) == parseInt(outcomeResultSpace.index));
                    if(!el){
                        // Lost
                        isWon = false;
                        winAmount = 0
                    }else{
                        isWon = true;
                        let probability = userResultSpace.reduce( (acc, result) => {
                            return acc+resultSpace[result.place].probability;
                        }, 0);
                        let odd = parseFloat(this.probabilityToOdd(probability));
                        maxWin = MathSingleton.multiplyAbsolutes(totalBetAmount, odd);
                        /* Default Logic */
                        let houseEdgeBalance = this.getRealOdd(maxWin, houseEdge);
                        winAmount = parseFloat(maxWin - houseEdgeBalance - jackpotAmount);
                    }  
                    break;
                };
                default : { 
                    throw new Error('Game Not Integrated')
                }
            }

            return {
                fee : parseFloat(parseFloat(Math.abs(totalBetAmount))*houseEdge/100),
                maxWinAmount : parseFloat(maxWin),
                winAmount : parseFloat(winAmount),
                totalBetAmount : parseFloat(totalBetAmount),
                isWon
            }
        }catch(err){
            throw err;
        }
    }

    /**
     * 
     * @param {Float} betAmount 
     * @param {Float} odd 
     * @param {Int} houseEdge 
     */

    calculateMaxWinAmount({userResultSpace, resultSpace, houseEdge, game}){

        try{
            var winAmount, totalBetAmount;

            switch(game){
                case 'european_roulette_simple' : {
                    /* Calculate Multipliers on Odd (Example Roulette) */
                    let { maxWin, probability, place, value } = userResultSpace.reduce( (object, result) => {
                        if((result.place < 0) || (result.place >= resultSpace.length)){ throwError('BAD_BET')}
                        let probability = resultSpace[result.place].probability;
                        let maxWin = parseFloat(result.value)/parseFloat(probability);
                        if(maxWin > object.maxWin){
                            return {maxWin, probability, place : result.place, value : result.value};
                        }else{
                            return object;
                        }
                    }, {maxWin : 0, probability : 0, place : 0, value : 0});
                    totalBetAmount = parseFloat(userResultSpace.reduce( (acc, item) => {
                        if(typeof item.value != 'number'){ throwError('BAD_BET')}
                        if(item.value <= 0){ throw throwError('BAD_BET')}
                        return acc+item.value;
                    }, 0))
                    let houseEdgeBalance = this.getRealOdd(maxWin, houseEdge);
                    winAmount = parseFloat(maxWin - houseEdgeBalance);
                    break;
                };
                case 'wheel_simple' : {
                    if(userResultSpace.length != resultSpace.length){ throw throwError('BAD_BET')}
                    /* Calculate Multipliers on Odd (Example Roulette) */
                    let { maxWin } = userResultSpace.reduce( (object, result, index) => {
                        if((result.place < 0) || (result.place >= resultSpace.length)){ throwError('BAD_BET')}
                        if(result.place != index){ throwError('BAD_BET')};
                        let multiplier = resultSpace[result.place].multiplier;
                        let maxWin = parseFloat(result.value)*parseFloat(multiplier);
                        if(maxWin > object.maxWin){
                            return {maxWin,  multiplier, place : result.place, value : result.value};
                        }else{
                            return object;
                        }
                    }, {maxWin : 0, place : 0, value : 0});
                    var previousValue;
                    totalBetAmount = parseFloat(userResultSpace.reduce( (acc, item) => {
                        if(typeof item.value != 'number'){ throwError('BAD_BET')}
                        if(item.value <= 0){ throw throwError('BAD_BET')}
                        if(previousValue && (item.value != previousValue)){ throw throwError('BAD_BET')};
                        previousValue = item.value;
                        return acc+item.value;
                    }, 0))
                    let houseEdgeBalance = this.getRealOdd(maxWin, houseEdge);
                    winAmount = parseFloat(maxWin - houseEdgeBalance);
                    break;
                };
                case 'wheel_variation_1' : {
                    if(userResultSpace.length != resultSpace.length){ throw throwError('BAD_BET')}
                    /* Calculate Multipliers on Odd (Example Roulette) */
                    let { maxWin } = userResultSpace.reduce( (object, result, index) => {
                        if((result.place < 0) || (result.place >= resultSpace.length)){ throwError('BAD_BET')}
                        if(result.place != index){ throwError('BAD_BET')};
                        let multiplier = resultSpace[result.place].multiplier;
                        let maxWin = parseFloat(result.value)*parseFloat(multiplier);
                        if(maxWin > object.maxWin){
                            return {maxWin,  multiplier, place : result.place, value : result.value};
                        }else{
                            return object;
                        }
                    }, {maxWin : 0, place : 0, value : 0});
                    var previousValue;
                    totalBetAmount = parseFloat(userResultSpace.reduce( (acc, item) => {
                        if(typeof item.value != 'number'){ throwError('BAD_BET')};
                        if(item.value <= 0){ throw throwError('BAD_BET')};
                        if(previousValue && (item.value != previousValue)){ throw throwError('BAD_BET')};
                        previousValue = item.value;
                        return acc+item.value;
                    }, 0))
                    let houseEdgeBalance = this.getRealOdd(maxWin, houseEdge);
                    winAmount = parseFloat(maxWin - houseEdgeBalance);
                    break;
                };
                case 'plinko_variation_1' : {
                    if(userResultSpace.length != resultSpace.length){ throw throwError('BAD_BET')}
                    /* Calculate Multipliers on Odd (Example Roulette) */
                    let { maxWin } = userResultSpace.reduce( (object, result, index) => {
                        if(result.place != index){ throwError('BAD_BET')};
                        if((result.place < 0) || (result.place >= resultSpace.length)){ throwError('BAD_BET')}
                        let multiplier = resultSpace[result.place].multiplier;
                        let maxWin = parseFloat(result.value)*parseFloat(multiplier);
                        if(maxWin > object.maxWin){
                            return {maxWin,  multiplier, place : result.place, value : result.value};
                        }else{
                            return object;
                        }
                    }, {maxWin : 0, place : 0, value : 0});
                    var previousValue;
                    totalBetAmount = parseFloat(userResultSpace.reduce( (acc, item) => {
                        if(typeof item.value != 'number'){ throwError('BAD_BET')};
                        if(item.value <= 0){ throw throwError('BAD_BET')};
                        if(previousValue && (item.value != previousValue)){ throw throwError('BAD_BET')};
                        previousValue = item.value;
                        return acc+item.value;
                    }, 0))
                    let houseEdgeBalance = this.getRealOdd(maxWin, houseEdge);
                    winAmount = parseFloat(maxWin - houseEdgeBalance);
                    break;
                };
                case 'coinflip_simple' : {
                    if(userResultSpace.length != 1){ throw throwError('BAD_BET')}
                    /* Calculate Multipliers on Odd (Example Roulette) */
                    let probability = userResultSpace.reduce( (acc, result, index) => {
                        if((result.place < 0) || (result.place >= resultSpace.length)){ throwError('BAD_BET')}
                        return acc+resultSpace[result.place].probability;
                    }, 0);
                    let odd = parseFloat(this.probabilityToOdd(probability));
                    // ERROR : More than 1 
                    totalBetAmount = parseFloat(userResultSpace.reduce( (acc, item) => {
                        if(typeof item.value != 'number'){ throwError('BAD_BET')}
                        if(item.value <= 0){ throw throwError('BAD_BET')}
                        if((item.place < 0) || (item.place >= resultSpace.length)){ throwError('BAD_BET')}
                        return acc+item.value;
                    }, 0))
                    let winBalance = MathSingleton.multiplyAbsolutes(totalBetAmount, odd);
                    let houseEdgeBalance = this.getRealOdd(totalBetAmount, houseEdge);
                    winAmount = parseFloat(winBalance - houseEdgeBalance);
                    break;
                };
                case 'linear_dice_simple' : {
                    /* Calculate Multipliers on Odd (Example Roulette) */
                    let probability = userResultSpace.reduce( (acc, result) => {
                        if((result.place < 0) || (result.place >= resultSpace.length)){ throwError('BAD_BET')}
                        return acc+resultSpace[result.place].probability;
                    }, 0);
                    let odd = parseFloat(this.probabilityToOdd(probability));
                    var previousValue, previousPlace;
                    totalBetAmount = parseFloat(userResultSpace.reduce( (acc, item, index) => {
                        if(item.place != index){ throwError('BAD_BET')};
                        if(typeof item.value != 'number'){ throwError('BAD_BET')};
                        if(item.value <= 0){ throw throwError('BAD_BET')};
                        if(previousValue && (item.value != previousValue)){ throw throwError('BAD_BET')};
                        if(previousPlace && (item.place != (previousPlace + 1))){ throw throwError('BAD_BET')};
                        previousValue = item.value;
                        previousPlace = item.place;
                        return acc+item.value;
                    }, 0))
                    let winBalance = MathSingleton.multiplyAbsolutes(totalBetAmount, odd);
                    let houseEdgeBalance = this.getRealOdd(totalBetAmount, houseEdge);
                    winAmount = parseFloat(winBalance - houseEdgeBalance);
                    break;
                };
                default : { 
                    throw new Error('Game Not Integrated')
                }
            }
            return {
                maxWinAmount : winAmount, 
                fee : parseFloat(parseFloat(Math.abs(totalBetAmount))*houseEdge/100),
                totalBetAmount : parseFloat(totalBetAmount)
            }
        }catch(err){
            throw err;
        }
    }

    /**
     * 
     * @param {Float} probability 
     */

    probabilityToOdd(probability){
        return 1/MathSingleton.toFloat(probability);
    }
}



let CasinoLogicSingleton = new CasinoLogic();

export default CasinoLogicSingleton;