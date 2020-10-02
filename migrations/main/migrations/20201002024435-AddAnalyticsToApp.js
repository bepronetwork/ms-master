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
      let processObj = new Progress(processIndex, "ADD_ANALYTICS_TO_APP");
      for (let app of apps) {
        processObj.setProcess(processIndex);
        processIndex--;
        let analytics = await db.collection('analytics').findOne({ _id: app.analytics });
        if (analytics === null) {
          let newAnalytics = await db.collection('analytics').insertOne({
            google_tracking_id: null,
            __v: 0
          });
          await db.collection('apps').updateOne(
            { _id: app._id },
            { $set: { "analytics": newAnalytics.ops[0]._id } }
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
