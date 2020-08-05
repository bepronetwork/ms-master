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
      let toptabs = await db.collection('toptabs').find().skip(1000 * index).limit(1000).toArray();
      if (toptabs.length === 0) {
        break;
      }
      let processIndex = toptabs.length;
      let processObj = new Progress(processIndex, "MODIFY_TOP_TAB");
      for (let topTab of toptabs) {
        processObj.setProcess(processIndex);
        processIndex--;
        await db.collection('toptabs').updateOne(
          { _id: topTab._id },
          {
            $set: {
              ids: [
                {
                  _id: new ObjectId(),
                  icon: "https://i.ibb.co/h96g1bx/Casino.png",
                  name: "Casino",
                  link_url: "/casino"
                },
                {
                  _id: new ObjectId(),
                  icon: "https://i.ibb.co/F6RLGVz/Esports.png",
                  name: "Esports",
                  link_url: "/esports"
                }
              ],
              __v: 0
            }
          });
      }
      processObj.destroyProgress();
    }
  },

  async down(db, client) {
    // Nothing
  }
};
