require('dotenv').config({ path: '../.env' });
console.log(process.env.MONGO_CONNECTION_STRING);
module.exports = {
    MONGO_CONNECTION_STRING: process.env.MONGO_CONNECTION_STRING
}