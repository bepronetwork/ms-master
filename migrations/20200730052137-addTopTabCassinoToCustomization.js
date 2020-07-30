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
    while(true) {
      index++;
      let customizations = await db.collection('customizations').find().skip(1000*index).limit(1000).toArray();
      if(customizations.length === 0){
        break;
      }
      let processIndex = customizations.length;
      let processObj = new Progress(processIndex, "ADD_TOP_TAB_CASSINO_TO_CUSTOMIZATION");
      for (let customization of customizations) {
        processObj.setProcess(processIndex);
        processIndex--;
        let topTabCassino = await db.collection('toptabcassinos').findOne({ _id: customization.topTabCassino });
        if (topTabCassino === null) {
          let newTopTabCassino = await db.collection('toptabcassinos').insertOne({
            topTabCassino : [{
              _id: new ObjectId(),
              icon: "",
              name: "",
              link_url: ""
          }],
          __v: 0
          });
          await db.collection('customizations').updateOne(
            { _id: customization._id },
            { $set: { "topTabCassino": newTopTabCassino.ops[0]._id } }
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
