import { Channel } from "amqplib";
import config from "../../../config/rabbitmqConfig";
import { randomUUID } from "crypto";
import { EventEmitter } from "events";

export default class Producer {
    constructor(private channel: Channel, private replayQueueName: string,private eventEmitter:EventEmitter) { }

    async produceMessages(data: any,operation:string) {

        const uuid = randomUUID()

        this.channel.sendToQueue(config.rabbitMQ.queues.orderQueue, Buffer.from(JSON.stringify(data)), {
            replyTo: this.replayQueueName,
            correlationId: uuid,
            expiration:10,
            headers:{
                function: operation
            }
        })

        return new Promise((resolve,reject)=>{
            this.eventEmitter.once(uuid,async(data)=>{
                const reply = JSON.parse(data.content.toString())
                resolve(reply);
            })
        })
      

    }
}
