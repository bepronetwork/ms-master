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
      let customizations = await db.collection('customizations').find({topTab: null}).skip(1000 * index).limit(1000).toArray();
      if (customizations.length === 0) {
        break;
      }
      let processIndex = customizations.length;
      let processObj = new Progress(processIndex, "ADD_TOP_TAB_TO_CUSTOMIZATION");
      for (let customization of customizations) {
        processObj.setProcess(processIndex);
        processIndex--;
        let topTab = await db.collection('toptabs').findOne({ _id: customization.topTab });
        if (topTab === null) {
          let newTopTab = await db.collection('toptabs').insertOne({
            ids: [
              {
                _id: new ObjectId(),
                icon: "https://i.ibb.co/h96g1bx/Casino.png",
                name: "Casino",
                link_url: "/"
              },
              {
                _id: new ObjectId(),
                icon: "https://i.ibb.co/F6RLGVz/Esports.png",
                name: "Esports",
                link_url: "/"
              }
            ],
            __v: 0
          });
          await db.collection('customizations').updateOne(
            { _id: customization._id },
            { $set: { "topTab": newTopTab.ops[0]._id } }
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
