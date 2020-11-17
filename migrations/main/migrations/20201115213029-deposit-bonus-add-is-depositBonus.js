var ObjectId = require('mongodb').ObjectID
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
      let depositBonus = await db.collection('depositbonus').find().skip(1000 * index).limit(1000).toArray();
      if (depositBonus.length === 0) {
        break;
      }
      let processIndex = depositBonus.length;
      let processObj = new Progress(processIndex, "UPDATE_DEPOSIT_BONUS");
      for (let bonus of depositBonus) {
        processObj.setProcess(processIndex);
        processIndex--;

        let wallet = Array.isArray(bonus.multiplier) ? bonus.multiplier.map((item)=>{
          return {currency: item.currency, value: bonus.isDepositBonus};
        }) : [];

        await db.collection('depositbonus').updateOne(
          { _id: bonus._id },
          { $set: { "isDepositBonus": wallet } }
        );
        console.log(bonus._id);
      }
      processObj.destroyProgress();
    }
  },

  async down(db, client) {
    // Nothing
  }
};
