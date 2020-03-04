module.exports = {
  async up(db, client) {
    let games = await db.collection('games').find().toArray();
    for (let game of games) {
      await db.collection('games').updateOne(
        { _id: game._id },
        { $set: { "background_url": null } }
      )
    }
  },

  async down(db, client) {
    // TODO write the statements to rollback your migration (if possible)
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  }
};
