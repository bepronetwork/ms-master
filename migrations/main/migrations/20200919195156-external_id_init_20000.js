module.exports = {
  async up(db, client) {
    let counts = await db.collection('identitycounters').find().toArray();
    for(let count of counts) {
      await db.collection('identitycounters').updateOne(
        { _id: count._id },
        { $set: { "count": 20000 } }
      );
    }
  },

  async down(db, client) {
    // TODO write the statements to rollback your migration (if possible)
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  }
};
