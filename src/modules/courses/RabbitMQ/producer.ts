import { Channel } from "amqplib";
import config from "../../../config/rabbitmqConfig";
import { randomUUID } from "crypto";

export default class Producer {
    constructor(private channel: Channel, private replayQueueName: string) { }

    async produceMessages(data: any) {

        const uuid = randomUUID()
        console.log("the correlation id is :", uuid)


        this.channel.sendToQueue(config.rabbitMQ.queues.rpcQueue, Buffer.from(JSON.stringify(data)), {
            replyTo: this.replayQueueName,
            correlationId: uuid
        })
    }
}