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
      let games = await db.collection('games').find({name: "Slots"}).toArray();
      if (games.length === 0) {
        console.log("ADD_SLOTS_TO_ECOSYSTEM");
        var resultSpace = [
          {
            "formType": "0",
            "probability": 0.54,
            "multiplier": 0.1,
            "__v": 0
          },
          {
            "formType": "1",
            "probability": 0.3,
            "multiplier": 0.6,
            "__v": 0
          },
          {
            "formType": "2",
            "probability": 0.1,
            "multiplier": 1,
            "__v": 0
          },
          {
            "formType": "3",
            "probability": 0.0258,
            "multiplier": 2,
            "__v": 0
          },
          {
            "formType": "4",
            "probability": 0.026,
            "multiplier": 2.2,
            "__v": 0
          },
          {
            "formType": "5",
            "probability": 0.002,
            "multiplier": 3,
            "__v": 0
          },
          {
            "formType": "6",
            "probability": 0.0016,
            "multiplier": 4,
            "__v": 0
          },
          {
            "formType": "7",
            "probability": 0.0014,
            "multiplier": 5,
            "__v": 0
          },
          {
            "formType": "8",
            "probability": 0.0012,
            "multiplier": 10,
            "__v": 0
          },
          {
            "formType": "9",
            "probability": 0.0008,
            "multiplier": 40,
            "__v": 0
          },
          {
            "formType": "10",
            "probability": 0.0006,
            "multiplier": 60,
            "__v": 0
          },
          {
            "formType": "11",
            "probability": 0.0004,
            "multiplier": 100,
            "__v": 0
          },
          {
            "formType": "12",
            "probability": 0.0002,
            "multiplier": 200,
            "__v": 0
          }
        ];
        var listResultSpace = [];
        for(let result of resultSpace){
          let resultInsert = await db.collection('resultspaces').insertOne(result)
          listResultSpace.push(resultInsert.ops[0]._id)
        }
        await db.collection('games').insertOne({
          "name": "Slots",
          "metaName": "slots_simple",
          "description": "Slots with 13 Icons",
          "image_url": "https://storage.googleapis.com/betprotocol-game-images/001-plinko_variation_1.png",
          "isValid": true,
          "rules": "1 - 13 Icons are possible to be drawn \n 2 - Everytime the same Icon is drawn your odd is multiplied by 2",
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
