import GoogleStorageSingleton from './googleStorage';
import HerokuClientSingleton from './heroku';
import SendInBlue from './sendInBlue';
import BitGoSingleton from './bitgo';
const SendInBlueFunctions = require('./sendInBlue/functions.json');

export {
    GoogleStorageSingleton,
    HerokuClientSingleton,
    SendInBlue,
    BitGoSingleton,
    SendInBlueFunctions
}