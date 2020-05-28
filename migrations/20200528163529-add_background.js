class Progress {

  constructor(value, name) {
      this.progress = value;
      this.name     = name;
      this.objProgress = setInterval(()=>{
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

    let customizations = await db.collection('customizations').find({background:null}).toArray();
    let processIndex  = customizations.length;
    let processObj    = new Progress(processIndex, "ADD_BACKGROUND");
    for(let customization of customizations) {
      processObj.setProcess(processIndex);
      processIndex --;
      let result = await db.collection('backgrounds').insertOne({id: '', __v : 0});
      await db.collection('customizations').updateOne(
        { _id: customization._id },
        { $set: { "background": result.ops[0]._id } }
      )
      console.log(customization._id);
      break;
    }
    processObj.destroyProgress();
  },

  async down(db, client) {
  }
};
