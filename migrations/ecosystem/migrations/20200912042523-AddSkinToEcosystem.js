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
      let skins = await db.collection('skins').find({name: "Default"}).toArray();
      if (skins.length === 0) {
        console.log("ADD_SKIN_DEFAULT_TO_ECOSYSTEM");
        await db.collection('skins').insertOne({
          "skin_type": "default",
          "name": "Default"
        })
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
