import GoogleStorageSingleton from './googleStorage';
import HerokuClientSingleton from './heroku';
import { SendInBlue , SendinBlueSingleton} from './sendInBlue';
import BitGoSingleton from './bitgo';
const SendInBlueFunctions = require('./sendInBlue/functions.json');
const SendInBlueAttributes = require('./sendInBlue/fields.json');
import { LogOwlSingleton } from "./logOwl";

export {
    LogOwlSingleton,
    GoogleStorageSingleton,
    HerokuClientSingleton,
    SendinBlueSingleton,
    SendInBlue,
    BitGoSingleton,
    SendInBlueFunctions,
    SendInBlueAttributes
}