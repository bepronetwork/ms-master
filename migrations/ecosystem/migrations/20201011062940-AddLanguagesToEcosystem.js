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
    let languagesToEcosystem = [
      {
        "prefix": "EN",
        "name": "English",
        "logo": "https://i.ibb.co/HBxGmJ2/reino-unido.png"
      },
      {
        "prefix": "KR",
        "name": "Korean",
        "logo": "https://i.ibb.co/TLvFxMz/coreia-do-sul.png"
      },
      {
        "prefix": "RU",
        "name": "Russian",
        "logo": "https://i.ibb.co/tQ75PmB/russia.png"
      },
      {
        "prefix": "CH",
        "name": "Chinese",
        "logo": "https://i.ibb.co/wRsJKQd/china.png"
      },
      {
        "prefix": "JP",
        "name": "Japanese",
        "logo": "https://i.ibb.co/x6tLddF/japao.png"
      },
    ]
    for(let languagesAvailable of languagesToEcosystem){
      let languages = await db.collection('languages').find({ prefix: languagesAvailable.prefix }).toArray();
      if (languages.length === 0) {
        console.log(`ADD_${languagesAvailable.name.toUpperCase()}_LANGUAGE_TO_ECOSYSTEM`);
        await db.collection('languages').insertOne({
          "prefix": languagesAvailable.prefix,
          "name": languagesAvailable.name,
          "logo": languagesAvailable.logo,
          "__v": 0
        });
      } else {
        for(let language of languages){
          console.log(`UPDATE_${languagesAvailable.name.toUpperCase()}_LANGUAGE_TO_ECOSYSTEM`);
          await db.collection('languages').updateOne(
            { _id: language._id },
            {
              $set: {
                name: languagesAvailable.name,
                logo: languagesAvailable.logo
              }
            }
          )
        }
      }
    }
  },

  async down(db, client) {
    // Nothing
  }
};
