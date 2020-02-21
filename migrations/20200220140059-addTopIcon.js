module.exports = {
  async up(db, client) {
    let customizations = await db.collection('customizations').find().toArray();
    for (let customization of customizations) {
      let topIcon = await db.collection('topicons').findOne({ _id: customization.topIcon });
      if (topIcon === null) {
        let newTopIcon = await db.collection('topicons').insertOne({
          __v: 0
        });
        await db.collection('customizations').updateOne(
          { _id: customization._id },
          { $set: { "topIcon": newTopIcon.ops[0]._id } }
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
