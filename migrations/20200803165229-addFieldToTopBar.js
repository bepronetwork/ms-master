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
      let topbars = await db.collection('topbars').find({isTransparent: null}).skip(1000*index).limit(1000).toArray();
      if(topbars.length === 0){
        break;
      }
      let processIndex = topbars.length;
      let processObj = new Progress(processIndex, "ADD_IS_TRANSPARENT_FOR_TOP_BAR_CUSTOMIZATION");
      for (let topBar of topbars) {
        processObj.setProcess(processIndex);
        processIndex--;
        if (topBar.isTransparent == (null || undefined)) {
          await db.collection('topbars').updateOne(
            { _id: topBar._id },
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
