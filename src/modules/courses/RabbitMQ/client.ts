import { Connection ,connect , Channel } from "amqplib";
import config from "../../../config/rabbitmqConfig"
import Consumer from "./consumer";
import Producer from "./producer";

export default class RabbitMQClient {

    private producer! :Producer;
    private consumer! : Consumer;
    private connection!: Connection;
    private producerChannel! : Channel;
    private consumerChannel! : Channel;

    async initialize() {
        try{
            this.connection = await connect(config.rabbitMQ.url)

            this.producerChannel = await this.connection.createChannel()

            this.consumerChannel = await this.connection.createChannel()

            const {queue:replyQueueName} = await this.consumerChannel.assertQueue('',{exclusive:true})

            this.consumer = new Consumer(this.consumerChannel,replyQueueName)

            this.producer = new Producer(this.producerChannel,replyQueueName);
            this.consumer = new Consumer(this.consumerChannel, replyQueueName)

            this.consumer.consumeMesssages()

        }catch(error){
            console.log("rabbit mq error",error)
        }
    }

    async produce(data:any){
        return await this.producer.produceMessages(data)
    }


}
