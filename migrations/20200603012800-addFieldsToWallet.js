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
      let wallets = await db.collection('wallets').find({ bonusAmount: null, minBetAmountForBonusUnlocked: null, incrementBetAmountForBonus: null }).skip(1000 * index).limit(1000).toArray();
      if (wallets.length === 0) {
        break;
      }
      let processIndex = wallets.length;
      let processObj = new Progress(processIndex, "ADD_MULTIPLIER_TO_DEPOSIT_BONUS");
      for (let wallet of wallets) {
        processObj.setProcess(processIndex);
        processIndex--;
        await db.collection('wallets').updateOne(
          { _id: wallet._id },
          {
            $set: {
              "bonusAmount": 0,
              "minBetAmountForBonusUnlocked": 0,
              "incrementBetAmountForBonus": 0
            }
          }
        )
      }
      processObj.destroyProgress();
    }
  },

  async down(db, client) {
    // Nothing
  }
};
