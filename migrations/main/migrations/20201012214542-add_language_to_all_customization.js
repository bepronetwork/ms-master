var ObjectId = require('mongodb').ObjectID
class Progress {
  constructor(value, name) {
    this.progress = value;
    this.name = name;
    this.objProgress = setInterval(() => {
      console.clear(); console.log(this.name);
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
    let index = -1;
    while (true) {
      index++;
      let apps = await db.collection('apps').find().skip(1000 * index).limit(1000).toArray();
      if (apps.length === 0) {
        break;
      }
      let processIndex = apps.length;
      let processObj = new Progress(processIndex, "ADD_LANGUAGE_TO_ALL_CUSTOMIZATION");
      for (let app of apps) {
        processObj.setProcess(processIndex);
        processIndex--;
        let customization = await db.collection('customizations').findOne({ _id: app.customization});
        let languageId    = customization.languages[0];

        let bannerFind    = await db.collection('banners').findOne({_id: customization.banners});
        // console.log("bannerFind ", bannerFind);
        await db.collection('banners').updateOne({_id: customization.banners},        { $set: { "languages":  [
          {
            language: languageId,
            ...bannerFind
          }
        ]} });
        let footersFind    = await db.collection('footers').findOne({_id: customization.footer});
        // console.log("footersFind ",footersFind);
        await db.collection('footers').updateOne({_id: customization.footer},         { $set: { "languages":  [
          {
            language: languageId,
            ...footersFind
          }
        ]} });
        let subsectionsFind    = await db.collection('subsections').findOne({_id: customization.subSections});
        // console.log("subsectionsFind ",subsectionsFind);
        await db.collection('subsections').updateOne({_id: customization.subSections},{ $set: { "languages":  [
          {
            language: languageId,
            ...subsectionsFind
          }
        ]} });
        let topbarsFind    = await db.collection('topbars').findOne({_id: customization.topBar});
        // console.log("topbarsFind ",topbarsFind);
        await db.collection('topbars').updateOne({_id: customization.topBar},         { $set: { "languages":  [
          {
            language: languageId,
            ...topbarsFind
          }
        ]} });
        let toptabsFind    = await db.collection('toptabs').findOne({_id: customization.topTab});
        // console.log("toptabsFind ",toptabsFind);
        await db.collection('toptabs').updateOne({_id: customization.topTab},         { $set: { "languages":  [
          {
            language: languageId,
            ...toptabsFind
          }
        ]} });
      }
      processObj.destroyProgress();
    }
  },

  async down(db, client) {
    // Nothing
  }
};
