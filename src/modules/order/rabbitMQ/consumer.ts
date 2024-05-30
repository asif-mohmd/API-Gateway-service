import { Channel, ConsumeMessage } from "amqplib";
import { EventEmitter } from "events";

export default class Consumer {

  constructor(private channel: Channel, private replyQueueName: string ,private eventEmitter: EventEmitter) {}

  async consumeMesssages(){
    console.log("ready to consume messages..")

    this.channel.consume(this.replyQueueName, (message: ConsumeMessage | null)=>{
        if (message) {
            // console.log("the replay is ...",JSON.parse(message.content.toString()))
            this.eventEmitter.emit(message.properties.correlationId.toString(),message)
        } else {
            // console.log("No message received");
        }

    },{
      noAck: true
    } )

  }



}
 