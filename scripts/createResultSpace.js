/* Variables */
const totalProbability = 1;
const possibilities = 10000;

/* Non Variables */

let eachProbability = totalProbability/possibilities;
var object = {};
let accProbability = 0;
if(eachProbability != new String(eachProbability)) {throw new Error(`Probability is badly parsed`)}

for(var i = 1; i <= possibilities; i++){
    
    object[i] = {
        formType : new String(i),
        probability : eachProbability
    }
    accProbability = accProbability + eachProbability;
    
}

var fs = require("fs");


fs.writeFile("resultSpace.js", JSON.stringify(object), (err) => {
  if (err) console.log(err);
  console.log("Successfully Written to File.");
});
