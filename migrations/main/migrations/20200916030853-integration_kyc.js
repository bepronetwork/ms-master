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
      let processObj = new Progress(processIndex, "ADD_KYC_TO_INTEGRATIONS");
      for (let integration of integrations) {
        processObj.setProcess(processIndex);
        processIndex--;
        let kyc = await db.collection('kycs').findOne({ _id: integration.kyc });
        if (kyc === null) {
          let newKyc = await db.collection('kycs').insertOne({
            clientId: '',
            flowId: '',
            name: 'Kyc',
            metaName: 'kyc',
            isActive: false,
            link: 'https://getmati.com',
            __v: 0
          });
          await db.collection('integrations').updateOne(
            { _id: integration._id },
            { $set: { "kyc": newKyc.ops[0]._id } }
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
