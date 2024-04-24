import { Channel, ConsumeMessage } from "amqplib";

export default class Consumer {

  constructor(private channel: Channel, private replyQueueName: string) {}

  async consumeMesssages(){
    console.log("ready to consume messages..")

    this.channel.consume(this.replyQueueName, (message: ConsumeMessage | null)=>{
        if (message) {
            console.log("the replay is ...", JSON.parse(message.content.toString()))
        } else {
            console.log("No message received");
        }

    } )

  }



}
