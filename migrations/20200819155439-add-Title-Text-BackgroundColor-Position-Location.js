
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
    let processObj    = new Progress(processIndex, "ADD_TITLE_TEXT_BACKGROUNDCOLOR_POSITION_LOCATION");
    for (let subSection of subSections) {

      processObj.setProcess(processIndex);
      processIndex --;

      let ids = subSection.ids;
      let newIds = [];

      for(let id of ids) {
        newIds.push({
          ...id,
          text             : "",
          background_color : "",
          position         : "",
          location         : ""
        });
      }

      await db.collection('subSectionS').updateOne(
        { _id: subSection._id },
        { $set:
          {
            ids: newIds
          }
        }
      );

    }

    processObj.destroyProgress();
  },
  async down(db, client) {}
};