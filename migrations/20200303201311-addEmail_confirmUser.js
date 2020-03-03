module.exports = {
  async up(db, client) {
    let users = await db.collection('users').find().toArray();
    for (let user of users) {
      if(user.email_confirmed == undefined){
        console.log(user._id);
        await db.collection('users').updateOne(
          { _id: user._id },
          { $set: { "email_confirmed": true } }
        );
      }
    }
  },
  async down(db, client) {}
};
