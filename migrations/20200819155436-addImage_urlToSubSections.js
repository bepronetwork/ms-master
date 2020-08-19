class Progress {

  constructor(value, name) {
      this.progress = value;
      this.name     = name;
      this.objProgress = setInterval(()=>{
        console.clear();
        console.log(this.name);
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
    let subSections = await db.collection('subSections').find().toArray();
    let processIndex  = subSections.length;
    let processObj    = new Progress(processIndex, "ADD_IMAGE_URL_TO_SUBSECTIONS");

    for (let subSection of subSections) {
      processObj.setProcess(processIndex);
      processIndex --;
      if (subSection.ids == null || subSection.ids.length <= 0) {
        await db.collection('subSections').updateOne(
          { _id: subSection._id },
          {
            $set: {
              "ids": [{
                "image_url": "",
                "background_url": ""
              }]
            }
          }
        )
      } else {
        let result = [];
        for (let id of subSection.ids) {
          if (typeof id == "string" ) {
            result.push({
              image_url: id,
              background_url: ""
            });
          } else if (id === null ) {
            result.push({
              image_url: "",
              background_url: ""
            });
          } else if(typeof id.image_url == "object") {
            result.push({
              image_url: "",
              background_url: ""
            });
          } else if (typeof id.image_url == "string" ) {
            result.push({
              image_url: id.image_url,
              background_url: ""
            });
          }
        }
        if (result.length > 0) {
          await db.collection('subSections').updateOne(
            { _id: subSection._id },
            { $set: { "ids": result } }
          )
        }
      }
    }
    processObj.destroyProgress();
  },

  async down(db, client) {
    // TODO write the statements to rollback your migration (if possible)
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  }
};