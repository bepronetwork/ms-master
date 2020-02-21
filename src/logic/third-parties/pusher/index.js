import Pusher from 'pusher';
import { PUSHER_APP_ID, PUSHER_APP_KEY, PUSHER_APP_SECRET} from '../../../config';
import { events } from './events';

class PusherNotifications{
    constructor(){
        this.pusher = new Pusher({
            appId: PUSHER_APP_ID,
            key: PUSHER_APP_KEY,
            secret: PUSHER_APP_SECRET,
            cluster: 'eu',
            useTLS: true
        });
    }

    authenticate({socketId, channel, data}){
        return this.pusher.authenticate(socketId, channel, data);
    }

    trigger({user_id, message, eventType}){
        let event = events.find( e => e.toLowerCase() == eventType.toLowerCase());
        console.log("rwtherhterthert")
        if(!event){console.err(`Event Type does not Exist, please choose either ${events.map( e => console.log)}`)};

        let res = this.pusher.trigger(`private-${user_id}`, event, {
            type : event,
            message 
        });
        console.log("a", res)
        return res;
    }


}


var PusherSingleton = new PusherNotifications();

export default PusherSingleton;