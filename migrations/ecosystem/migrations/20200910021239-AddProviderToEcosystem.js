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
      let casinoproviders = await db.collection('casinoproviders').find({name: "Webslots"}).skip(1000 * index).limit(1000).toArray();
      if (casinoproviders.length === 0) {
        console.log("ADD_PROVIDER_TO_ECOSYSTEM");
        await db.collection('casinoproviders').insertOne({
          api_key: "",
          name: 'Webslots',
          logo: 'https://images.zenhubusercontent.com/5ded93b598047a56e64a162c/275fe0dd-786f-478c-99db-256ac4b79e66',
          api_url: "https://webslot.co",
          partner_id: "",
          __v: 0
        });
        break;
      } else{
        let processIndex = casinoproviders.length;
        let processObj = new Progress(processIndex, "ADD_PROVIDER_TO_ECOSYSTEM");
        for(casinoProvider of casinoproviders){
          processObj.setProcess(processIndex);
          processIndex--;
          await db.collection('casinoproviders').updateOne(
            { _id: casinoProvider._id },
            { $set: {
              name: 'Webslots',
              logo: 'https://images.zenhubusercontent.com/5ded93b598047a56e64a162c/275fe0dd-786f-478c-99db-256ac4b79e66'
            } }
          )
        }
        processObj.destroyProgress();
        break;
      }
    }
  },

  async down(db, client) {
    // Nothing
  }
};
