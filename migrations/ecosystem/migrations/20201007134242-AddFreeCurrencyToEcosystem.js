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
    let addons = await db.collection('addons').find({ name: "Free Currency" }).toArray();
    if (addons.length === 0) {
      console.log("ADD_FREE_CURRENCY_TO_ECOSYSTEM");
      await db.collection('addons').insertOne({
        name: "Free Currency",
        description: "Free Currency",
        image_url: 'https://i.ibb.co/7J4HBKw/bonus.png',
        price: 0,
        endpoint: "/app/freeCurrency/add",
      });
    } else {
      console.log("UPDATE_FREE_CURRENCY_TO_ECOSYSTEM");
      for (addon of addons) {
        await db.collection('addons').updateOne(
          { _id: addon._id },
          {
            $set: {
              description: "Free Currency",
              image_url: 'https://i.ibb.co/7J4HBKw/bonus.png',
              price: 0,
              endpoint: "/app/freeCurrency/add"
            }
          }
        )
      }
    }
  },

  async down(db, client) {
    // Nothing
  }
};
