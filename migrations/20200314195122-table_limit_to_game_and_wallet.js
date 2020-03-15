
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
    let games = await db.collection('games').find().limit(2).sort({_id : -1}).toArray();
    let processIndex  = games.length;
    let processObj    = new Progress(processIndex, "TABLE_LIMIT_TO_GAME_AND_WALLET");
    for (let game of games) {
      // console.log(game);
      processObj.setProcess(processIndex);
      processIndex --;
      if(game.tableLimit != undefined){

        const ObjectID = require('mongodb').ObjectID;

        let app = await db.collection('apps').find({"_id" : new ObjectID(game.app.toString())}).toArray();
        let wallet = null;
        if(app.length >= 1) {
          app = app[0];
          wallet = (app.wallet!=undefined && app.wallet.length >=1) ? app.wallet[0] : null;
        }

        if( wallet != null ) {
          await db.collection('games').update(
            { _id: game._id },
            { $unset: { "tableLimit": "" } }
          );

          await db.collection('games').updateOne(
            { _id: game._id },
            { $set: { "wallets": [
              {
                wallet: wallet,
                tableLimit: 0
              }
            ] } }
          );
        }

      }
    }
    processObj.destroyProgress();
  },
  async down(db, client) {}
};
