import {
    getUserAuth,
    getPushNotificationsChannel
} from '../../../methods';

import chai from 'chai';
import Pusher from 'pusher';
import { mochaAsync } from '../../../utils';


const expect = chai.expect;

context(`Get`, async () =>  {
    var user, pusher, channel;

    before( async () =>  {
        user = (await getUserAuth({user : global.test.user.id}, global.test.user.bearerToken, {id : global.test.user.id})).data.message;

        pusher = new Pusher(process.env.PUSHER_APP_KEY, 
        { 
            cluster : 'eu',
            forceTLS: true,
            authTransport: 'jsonp',
            authEndpoint: 'http://localhost:8000/api/users/pusher/auth',
            auth : {
                params : {
                    user : user.id
                },
                headers : {
                    'content-type' : 'application/json',
                    'authorization' : `Bearer ${user.bearerToken}`,
                    payload : { 'id' : user.id}
                }
            }
        }); 
    });

    it('should get channel', mochaAsync(async () => {
        channel = await pusher.subscribe(`private-${user.id}`);
        expect(channel).to.not.be.null;
    }));

    it('should get channel update', mochaAsync(async () => {
        channel.bind('my-event', (data) => {
            console.log('Received my-event with message: ' + data.message);
        });

    }));
});