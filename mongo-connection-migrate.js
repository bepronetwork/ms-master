require('dotenv').config({ path: '../../.env' });
module.exports = {
    MONGO_CONNECTION_STRING: process.env.MONGO_CONNECTION_STRING
}