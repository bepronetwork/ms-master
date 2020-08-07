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
      let toptabs = await db.collection('toptabs').find({isTransparent: null}).skip(1000*index).limit(1000).toArray();
      if(toptabs.length === 0){
        break;
      }
      let processIndex = toptabs.length;
      let processObj = new Progress(processIndex, "ADD_IS_TRANSPARENT_FOR_TOP_TAB_CUSTOMIZATION");
      for (let topTab of toptabs) {
        processObj.setProcess(processIndex);
        processIndex--;
        if (topTab.isTransparent == (null || undefined)) {
          await db.collection('toptabs').updateOne(
            { _id: topTab._id },
            { $set: { "isTransparent": false } }
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
