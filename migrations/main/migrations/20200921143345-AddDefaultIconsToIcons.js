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
      let icons = await db.collection('icons').find({useDefaultIcons: null}).skip(1000*index).limit(1000).toArray();
      if(icons.length === 0){
        break;
      }
      let processIndex = icons.length;
      let processObj = new Progress(processIndex, "ADD_DEFAULT_ICON_FOR_ICON_CUSTOMIZATION");
      for (let icon of icons) {
        processObj.setProcess(processIndex);
        processIndex--;
        if (icon.useDefaultIcons == (null || undefined)) {
          await db.collection('icons').updateOne(
            { _id: icon._id },
            { $set: { "useDefaultIcons": true } }
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
