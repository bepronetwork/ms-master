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
      let banners = await db.collection('banners').find().skip(1000*index).limit(1000).toArray();
      if(banners.length === 0){
        break;
      }
      let processIndex = banners.length;
      let processObj = new Progress(processIndex, "ADD_FULL_WIDTH_FOR_BANNERS_CUSTOMIZATION");
      for (let banner of banners) {
        processObj.setProcess(processIndex);
        processIndex--;
        if (banner.fullWidth == (null || undefined)) {
          await db.collection('banners').updateOne(
            { _id: banner._id },
            { $set: { "fullWidth": false } }
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
