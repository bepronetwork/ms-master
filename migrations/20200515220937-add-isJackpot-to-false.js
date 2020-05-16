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
      let bets = await db.collection('bets').find({ isJackpot: null }).skip(800*index).limit(800).toArray();
      if(bets.length === 0){
        break;
      }
      let processIndex = bets.length;
      let processObj = new Progress(processIndex, "ADD_IS_JACKPOT");
      for (let bet of bets) {
        processObj.setProcess(processIndex);
        processIndex--;
        if (bet.isJackpot === null || bet.isJackpot === undefined) {
          await db.collection('bets').updateOne(
            { _id: bet._id },
            { $set: { isJackpot: false } }
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
