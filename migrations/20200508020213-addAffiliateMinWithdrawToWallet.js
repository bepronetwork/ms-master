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
      let wallets = await db.collection('wallets').find().skip(1000*index).limit(1000).toArray();
      if(wallets.length === 0){
        break;
      }
      let processIndex = wallets.length;
      let processObj = new Progress(processIndex, "ADD_AFFILIATE_MIN_WITHDRAW_FIELD_TO_WALLET");
      for (let wallet of wallets) {
        processObj.setProcess(processIndex);
        processIndex--;
        if (wallet.affiliate_min_withdraw == (null || undefined)) {
          await db.collection('wallets').updateOne(
            { _id: wallet._id },
            { $set: { "affiliate_min_withdraw": 0.000001 } }
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
