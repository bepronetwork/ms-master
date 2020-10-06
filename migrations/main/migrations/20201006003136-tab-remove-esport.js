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
      let processObj = new Progress(processIndex, "FIX_TOP_TAB");
      for (let toptab of toptabs) {
        processObj.setProcess(processIndex);
        processIndex--;
        await db.collection('toptabs').updateOne(
          { _id: toptab._id },
          {
            $set: {
              "ids": [
                {
                  name: "Casino",
                  icon: "https://i.ibb.co/h96g1bx/Casino.png",
                  link_url: "/"
                }
              ]
            }
          }
        )
      }
      processObj.destroyProgress();
    }
  },

  async down(db, client) {
    // Nothing
  }
};