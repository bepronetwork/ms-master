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
        if (app.customization) {
          let customization = await db.collection('customizations').findOne({ _id: app.customization });
          let languageId = null;
          if (!customization.languages) {
            let newlanguages = await db.collection('languages').insertOne({
              isActivated: true,
              prefix: "EN",
              name: "English",
              logo: "https://storage.googleapis.com/betprotocol-apps/english.jpg",
              __v: 0
            });
            await db.collection('customizations').updateOne(
              { _id: customization._id },
              { $push: { "languages": newlanguages.ops[0]._id } }
            )
            languageId = newlanguages.ops[0]._id
          } else {
            languageId = customization.languages[0]
          }
          console.log(languageId)
          let bannerFind = await db.collection('banners').findOne({ _id: customization.banners });
          if (bannerFind && !bannerFind.languages) {
            await db.collection('banners').updateOne({ _id: customization.banners }, {
              $set: {
                "languages": [
                  {
                    language: languageId,
                    ...bannerFind
                  }
                ]
              }
            });
          }
          let footersFind = await db.collection('footers').findOne({ _id: customization.footer });
          if (footersFind && !footersFind.languages) {
            await db.collection('footers').updateOne({ _id: customization.footer }, {
              $set: {
                "languages": [
                  {
                    language: languageId,
                    ...footersFind
                  }
                ]
              }
            });
          }
          let subsectionsFind = await db.collection('subsections').findOne({ _id: customization.subSections });
          if (subsectionsFind && !subsectionsFind.languages) {
            await db.collection('subsections').updateOne({ _id: customization.subSections }, {
              $set: {
                "languages": [
                  {
                    language: languageId,
                    ...subsectionsFind
                  }
                ]
              }
            });
          }
          let topbarsFind = await db.collection('topbars').findOne({ _id: customization.topBar });
          if (topbarsFind && !topbarsFind.languages) {
            await db.collection('topbars').updateOne({ _id: customization.topBar }, {
              $set: {
                "languages": [
                  {
                    language: languageId,
                    ...topbarsFind
                  }
                ]
              }
            });
          }
          let toptabsFind = await db.collection('toptabs').findOne({ _id: customization.topTab });
          if (toptabsFind && !toptabsFind.languages) {
            await db.collection('toptabs').updateOne({ _id: customization.topTab }, {
              $set: {
                "languages": [
                  {
                    language: languageId,
                    ...toptabsFind
                  }
                ]
              }
            });
          }
        }
      }
      processObj.destroyProgress();
    }
  },

  async down(db, client) {
    // Nothing
  }
};