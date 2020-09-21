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
    let countIndex = 0;
    let index = -1;
    while (true) {
      index++;
      let users = await db.collection('users').find().skip(1000 * index).limit(1000).toArray();
      if (users.length === 0) {
        break;
      }
      let processIndex = users.length;
      let processObj = new Progress(processIndex, "EXTERNAL_ID_USER");
      for (let user of users) {
        processObj.setProcess(processIndex);
        processIndex--;
        countIndex++;
        await db.collection('users').updateOne(
          { _id: user._id },
          { $set: { "external_id": countIndex } }
        );
      }
      processObj.destroyProgress();
    }
  },

  async down(db, client) {
    // Nothing
  }
};
