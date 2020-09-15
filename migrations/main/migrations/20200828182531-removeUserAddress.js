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
      let users = await db.collection('users').find().skip(1000 * index).limit(1000).sort({ register_timestamp: -1 }).toArray();
      if (users.length === 0) {
        break;
      }
      let processIndex = users.length;
      let processObj = new Progress(processIndex, "REMOVE_USER_ADDRESS");
      for (let userObject of users) {
        processObj.setProcess(processIndex);
        processIndex--;
        if (!(Array.isArray(userObject.wallet))) {
          continue;
        } else {
          for (let walletObject of userObject.wallet) {
            if (walletObject != (null || undefined)) {
              let wallet = await db.collection('wallets').findOne({ _id: walletObject })
              if (wallet._id != (null || undefined)) {
                await db.collection('wallets').updateOne(
                  { _id: wallet._id },
                  { $set: { depositAddresses: [] } }
                );
              }
            }
          }
        }
      }
      processObj.destroyProgress();
    }
  },

  async down(db, client) {
    // Nothing
  }
};
