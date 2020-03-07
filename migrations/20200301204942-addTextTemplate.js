module.exports = {
  async up(db, client) {
    let mailsenders = await db.collection('mailsenders').find().toArray();
    for (let mailsender of mailsenders) {
      if (mailsender != undefined) {
        await db.collection('mailsenders').updateOne(
          { _id: mailsender._id },
          { $push: { "templateIds": { template_id: null, functionName: "USER_NOTIFICATION", contactlist_Id: 2 } } }
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
