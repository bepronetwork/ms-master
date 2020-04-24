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

    let apps = await db.collection('apps').aggregate([
      {
        '$lookup': {
          'from': 'games',
          'localField': 'games',
          'foreignField': '_id',
          'as': 'games'
        }
      }
    ]).toArray();

    let processIndex = apps.length;
    let processObj = new Progress(processIndex, "REMOVE_JACKPOT");
    for (let app of apps) {
      processObj.setProcess(processIndex);
      processIndex--;

      let games = app.games.find(g => g.name == 'Jackpot' );
      console.log(app.games);
      if(games != undefined) {
        console.log("Remove");
        await db.collection('apps').update(
          { _id: app._id },
          { $pull: { games: games._id } }
        );
      }

    }
    processObj.destroyProgress();
  },
  async down(db, client) {
    // Nothing
  }
};