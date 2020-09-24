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
      let processObj = new Progress(processIndex, "ADD_SOCIAL_LINKS_TO_CUSTOMIZATION");
      for (let customization of customizations) {
        processObj.setProcess(processIndex);
        processIndex--;
        let socialLink = await db.collection('sociallinks').findOne({ _id: customization.socialLink });
        if (socialLink === null) {
          let newSocialLink = await db.collection('sociallinks').insertOne({
            ids: [],
            __v: 0
          });
          await db.collection('customizations').updateOne(
            { _id: customization._id },
            { $set: { "socialLink": newSocialLink.ops[0]._id } }
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
