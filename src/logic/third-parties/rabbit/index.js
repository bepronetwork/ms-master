import { PORT_RABBIT, URL_RABBIT } from '../../../config';

class workerQueue {

    constructor() {
        this.__init__();
    }

    __init__() {
        this.__connectInstance = require('amqplib').connect(`amqp://${URL_RABBIT}:${PORT_RABBIT}`).then(conn => conn.createChannel());
    }

    __connect(){
        return this.__connectInstance;
    }

    __createQueue(channel, queue){
        return new Promise((resolve, reject) => {
        try{
            channel.assertQueue(queue, { durable: true });
            resolve(channel);
        }
        catch(err){ reject(err) }
        });
    }

    sendToQueue(queue, message){
        return new Promise((resolve) =>{
            this.__connect()
            .then(channel => this.__createQueue(channel, queue))
            .then(channel => {
                channel.sendToQueue( queue, Buffer.from(JSON.stringify(message)) );
                resolve(true);
            })
            .catch(err => console.log(err))
        });
    }
}

const workerQueueSingleton =  new workerQueue();

export {
    workerQueueSingleton
}