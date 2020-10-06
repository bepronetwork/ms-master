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
      let users = await db.collection('users').find().skip(1000 * index).limit(1000).toArray();
      if (users.length === 0) {
        break;
      }
      let processIndex = users.length;
      let processObj = new Progress(processIndex, "ADD_LAST_TIME_CURRENCY_FREE_USER");

      let currency  = await db.collection('currencies').find().toArray();
      let lastTimeCurrencyFree = currency.map((c)=>{return {date: 0, currency: c._id}});

      for (let userObject of users) {
        processObj.setProcess(processIndex);
        processIndex--;
        console.log(userObject._id);
        await db.collection('users').updateOne(
          { _id: userObject._id },
          { $set: { lastTimeCurrencyFree } }
        );

      }
      processObj.destroyProgress();
    }
  },

  async down(db, client) {
    // Nothing
  }
};
