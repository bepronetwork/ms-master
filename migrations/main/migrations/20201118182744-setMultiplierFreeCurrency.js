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
      let freecurrencies = await db.collection('freecurrencies').find().skip(1000 * index).limit(1000).toArray();
      if (freecurrencies.length === 0) {
        break;
      }
      let processIndex = freecurrencies.length;
      let processObj = new Progress(processIndex, "ADD_MULTIPLIER_TO_FREE_CURRENCY");
      for (let freecurrency of freecurrencies) {
        processObj.setProcess(processIndex);
        processIndex--;
        if (Array.isArray(freecurrency.wallets)) {
          let wallets = freecurrency.wallets.map((w) => {
            return {
              ...w,
              multiplier: 10
            }
          })
          await db.collection('freecurrencies').updateOne(
            { _id: freecurrency._id },
            { $set: { "wallets": wallets } },
            { new: true }
          );
        }
      }
      processObj.destroyProgress();
    }
  },

  async down(db, client) {
    // Nothing
  }
};
