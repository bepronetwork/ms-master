var security = require("../../utils/security");
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
      let chats = await db.collection('chats').find().skip(1000 * index).limit(1000).toArray();
      if (chats.length === 0) {
        break;
      }
      let processIndex = chats.length;
      let processObj = new Progress(processIndex, "ENCRYPT_CHAT_KEYS");
      for (let chat of chats) {
        processObj.setProcess(processIndex);
        processIndex--;
        let privateKey = !chat.privateKey ? null : security.prototype.encryptData(chat.privateKey);
        let publicKey = !chat.publicKey ? null : security.prototype.encryptData(chat.publicKey);
        await db.collection('chats').updateOne(
          { _id: chat._id },
          {
            $set: {
              "privateKey": privateKey,
              "publicKey": publicKey
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
