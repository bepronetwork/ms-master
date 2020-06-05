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
      let depositbonus = await db.collection('depositbonus').find().skip(1000 * index).limit(1000).toArray();
      if (depositbonus.length === 0) {
        break;
      }
      let processIndex = depositbonus.length;
      let processObj = new Progress(processIndex, "ADD_MULTIPLIER_TO_DEPOSIT_BONUS");
      for (let depositBonusObject of depositbonus) {
        processObj.setProcess(processIndex);
        processIndex--;
        await db.collection('depositbonus').updateOne(
          { _id: depositBonusObject._id },
          { $set: { "multiplier": 0 } }
        )
      }
      processObj.destroyProgress();
    }
  },

  async down(db, client) {
    // Nothing
  }
};
