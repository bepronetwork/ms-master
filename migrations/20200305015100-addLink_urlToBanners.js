module.exports = {
  async up(db, client) {
    let banners = await db.collection('banners').find().toArray();
    for (let banner of banners) {
      if (banner.ids == null || banner.ids.length <= 0) {
        await db.collection('banners').updateOne(
          { _id: banner._id },
          {
            $set: {
              "ids": [{
                "image_url": null,
                "link_url": null
              }]
            }
          }
        )
      } else {
        let result = [];
        for (let id of banner.ids) {
          if (!id.image_url) {
            result.push({
              image_url: id,
              link_url: null
            })
          }
        }
        if (result.length > 0) {
          await db.collection('banners').updateOne(
            { _id: banner._id },
            { $set: { "ids": result } }
          )
        }
      }
    }
  },

  async down(db, client) {
    // TODO write the statements to rollback your migration (if possible)
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  }
};
