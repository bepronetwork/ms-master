module.exports = {
  async up(db, client) {
    let customizations = await db.collection('customizations').find().toArray();
    for (let customization of customizations) {
      let loadingGif = await db.collection('loadinggifs').findOne({ _id: customization.loadingGif });
      if (loadingGif === null) {
        let newloadingGif = await db.collection('loadinggifs').insertOne({
          __v: 0
        });
        await db.collection('customizations').updateOne(
          { _id: customization._id },
          { $set: { "loadingGif": newloadingGif.ops[0]._id } }
        )
      }
    }
  },

  async down(db, client) {
    // TODO write the statements to rollback your migration (if possible)
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  }
};
