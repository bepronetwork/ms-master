'use strict'
require('dotenv').config();

const setLinkUrl = ({ ticker, address }) => {
  var link_url;
  if (process.env.ENV === "development") {
    switch (new String(ticker).toLowerCase().trim()) {
      case 'eth': {
        link_url = `https://kovan.etherscan.io/address/${address}`;
        return link_url;
      };
      default:
        link_url = address;
        return link_url;
    }
  } else if (process.env.ENV === "production") {
    switch (new String(ticker).toLowerCase().trim()) {
      case 'eth': {
        link_url = `https://etherscan.io/address/${address}`;
        return link_url;
      };
      default:
        link_url = address;
        return link_url;
    }
  }
}

module.exports = {
  async up(db, client) {
    let wallets = await db.collection('wallets').find().toArray();
    for (let wallet of wallets) {
      var address = '0X';
      var ticker = 'ETH';
      let currency = await db.collection('currencies').findOne({ _id: wallet.currency })
      try {
        ticker = currency.ticker
      } catch (error) {
        ticker = 'ETH'
      }
      if (wallet.bank_address != undefined) {
        address = wallet.bank_address
      }
      if (wallet.link_url == undefined) {
        var link_url = setLinkUrl({ address, ticker });
        await db.collection('wallets').updateOne(
          { _id: wallet._id },
          { $set: { "link_url": link_url } });
      }
    }
  },

  async down(db, client) {
    // TODO write the statements to rollback your migration (if possible)
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  }
};
