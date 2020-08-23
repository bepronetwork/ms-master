"use strict";

// In this file you can configure migrate-mongo
require('dotenv').config();

var config = {
  mongodb: {
    // TODO Change (or review) the url to your MongoDB:
    url: "".concat(process.env.MONGO_CONNECTION_STRING, "/admin?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&ssl=true"),
    // TODO Change this to your database name:
    databaseName: "main",
    options: {
      useNewUrlParser: true,
      // removes a deprecation warning when connecting
      useUnifiedTopology: true // removes a deprecating warning when connecting
      //   connectTimeoutMS: 3600000, // increase connection timeout to 1 hour
      //   socketTimeoutMS: 3600000, // increase socket timeout to 1 hour

    }
  },
  // The migrations dir, can be an relative or absolute path. Only edit this when really necessary.
  migrationsDir: "migrations",
  // The mongodb collection where the applied changes are stored. Only edit this when really necessary.
  changelogCollectionName: "changelog"
}; // Return the config as a promise

module.exports = config;