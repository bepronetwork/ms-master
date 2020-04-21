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

    let wallets = await db.collection('wallets').find().toArray();
    let processIndex = wallets.length;
    let processObj = new Progress(processIndex, "ADD_MIN_WITHDRAW_FIELD_TO_WALLET");
    for (let wallet of wallets) {
      console.log(wallet)
      processObj.setProcess(processIndex);
      processIndex--;
      if (wallet.min_withdraw == (null || undefined)) {
        await db.collection('wallets').updateOne(
          { _id: wallet._id },
          { $set: { "min_withdraw": 0.000001 } }
        )
      }


    }
    processObj.destroyProgress();
  },

  async down(db, client) {
    // Nothing
  }
};
