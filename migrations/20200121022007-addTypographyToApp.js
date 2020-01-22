module.exports = {
  async up(db, client) {
    // TODO write your migration here.
    let typography = await db.collection('typographies').find({}).toArray();
    await db.collection('apps').updateMany({typography:{$exists: false}}, {$set: {typography}});
  },

  async down(db, client) {
    // TODO write the statements to rollback your migration (if possible)
  }
};
