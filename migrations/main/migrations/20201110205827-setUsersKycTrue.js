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
      let apps = await db.collection('apps').find().skip(1000 * index).limit(1000).toArray();
      if (apps.length === 0) {
        break;
      }
      let processIndex = apps.length;
      let processObj = new Progress(processIndex, "UPDATE_USER_KYC_NEEDED_FOR_REAL_APPS");
      for (let app of apps) {
        processObj.setProcess(processIndex);
        processIndex--;
        if(!app.virtual){
          for(let user of app.users){
            await db.collection('users').updateOne(
              { _id: user },
              { $set: { "kyc_needed": true } }
            );
          }
        }
        processObj.setProcess(processIndex);
        processIndex--;
      }
      processObj.destroyProgress();
    }
  },

  async down(db, client) {
    // Nothing
  }
};
