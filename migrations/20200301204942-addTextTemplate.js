module.exports = {
  async up(db, client) {
    let mailsenders = await db.collection('mailsenders').find().toArray();
    for (let mailsender of mailsenders) {
      console.log(mailsender);
      if (mailsender != undefined) {
        await db.collection('mailsenders').updateOne(
          { _id: mailsender._id },
          { $push: { "templateIds": { template_id: null, functionName: "USER_TEXT_DEPOSIT_AND_WITHDRAW", contactlist_Id: 2 } } }
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
