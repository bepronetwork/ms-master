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
      let customizations = await db.collection('customizations').find().skip(1000 * index).limit(1000).toArray();
      if (customizations.length === 0) {
        break;
      }
      let processIndex = customizations.length;
      let processObj = new Progress(processIndex, "ADD_SKIN_TO_CUSTOMIZATION");
      for (let customization of customizations) {
        processObj.setProcess(processIndex);
        processIndex--;
        let skin = await db.collection('skins').findOne({ _id: customization.skin });
        if (skin === null) {
          let newSkin = await db.collection('skins').insertOne({
            skin_type: 'default',
            __v: 0
          });
          await db.collection('customizations').updateOne(
            { _id: customization._id },
            { $set: { "skin": newSkin.ops[0]._id } }
          )
        }
      }
      processObj.destroyProgress();
    }
  },

  async down(db, client) {
    // Nothing
  }
};
