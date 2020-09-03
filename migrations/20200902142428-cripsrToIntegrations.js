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
      let integrations = await db.collection('integrations').find().skip(1000 * index).limit(1000).toArray();
      if (integrations.length === 0) {
        break;
      }
      let processIndex = integrations.length;
      let processObj = new Progress(processIndex, "ADD_CRIPSR_TO_INTEGRATIONS");
      for (let integration of integrations) {
        processObj.setProcess(processIndex);
        processIndex--;
        let cripsr = await db.collection('cripsrs').findOne({ _id: integration.cripsr });
        if (cripsr === null) {
          let newSubSection = await db.collection('cripsrs').insertOne({
            key: '',
            name: 'Cripsr',
            metaName: 'cripsr',
            isActive: false,
            link: 'https://crisp.chat',
            __v: 0
          });
          await db.collection('integrations').updateOne(
            { _id: integration._id },
            { $set: { "cripsr": newSubSection.ops[0]._id } }
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
