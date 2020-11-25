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
      let balances = await db.collection('balances').find().skip(1000 * index).limit(1000).toArray();
      if (balances.length === 0) {
        break;
      }
      let processIndex = balances.length;
      let processObj = new Progress(processIndex, "ADD_MULTIPLIER_TO_BALANCE");
      for (let balance of balances) {
        processObj.setProcess(processIndex);
        processIndex--;
        let initialBalanceList = balance.initialBalanceList.map((b) => {
          return {
            ...b,
            multiplier: 10
          }
        })
        await db.collection('balances').updateOne(
          { _id: balance._id },
          { $set: { "initialBalanceList": initialBalanceList } },
          { new: true }
        );
      }
      processObj.destroyProgress();
    }
  },

  async down(db, client) {
    // Nothing
  }
};
