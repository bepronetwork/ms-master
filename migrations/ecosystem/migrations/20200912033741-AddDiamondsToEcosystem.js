var ObjectId = require('mongodb').ObjectID
class Progress {
  constructor(value, name) {
    this.progress = value;
    this.name = name;
    this.objProgress = setInterval(() => {
      console.clear(); console.log(this.name);
      console.log(`${this.progress} process left`);
    }, 2000);
  }

  setProcess(value) {
    this.progress = value;
  }

  destroyProgress() {
    clearInterval(this.objProgress);
  }

}


module.exports = {
  async up(db, client) {
    let index = -1;
    while (true) {
      index++;
      let games = await db.collection('games').find({metaName: "diamonds_simple"}).toArray();
      if (games.length === 0) {
        console.log("ADD_DIAMONDS_TO_ECOSYSTEM");
        var resultSpace = [
          {
            "formType": "0",
            "probability": 0.1499,
            "multiplier": 0,
            "__v": 0
          },
          {
            "formType": "1",
            "probability": 0.4998,
            "multiplier": 0.1,
            "__v": 0
          },
          {
            "formType": "2",
            "probability": 0.1874,
            "multiplier": 1,
            "__v": 0
          },
          {
            "formType": "3",
            "probability": 0.1249,
            "multiplier": 2,
            "__v": 0
          },
          {
            "formType": "4",
            "probability": 0.025,
            "multiplier": 4,
            "__v": 0
          },
          {
            "formType": "5",
            "probability": 0.0125,
            "multiplier": 5,
            "__v": 0
          },
          {
            "formType": "6",
            "probability": 0.0005,
            "multiplier": 10,
            "__v": 0
          }
        ];
        var listResultSpace = [];
        for(let result of resultSpace){
          let resultInsert = await db.collection('resultspaces').insertOne(result)
          listResultSpace.push(resultInsert.ops[0]._id)
        }
        await db.collection('games').insertOne({
          "name": "Diamonds",
          "metaName": "diamonds_simple",
          "description": "Diamonds with 7 Places",
          "image_url": "https://storage.googleapis.com/betprotocol-game-images/001-plinko_variation_1.png",
          "isValid": true,
          "rules": "1 - Don´t rob the Diamonds, you can see you there",
          "resultSpace": listResultSpace,
          "__v": 0
        });
        break;
      } else {
        break;
      }
    }
  },

  async down(db, client) {
    // Nothing
  }
};
