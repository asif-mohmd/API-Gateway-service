import { Connection ,connect , Channel } from "amqplib";
import config from "../../../config/rabbitmqConfig"
import Consumer from "./consumer";
import Producer from "./producer";
import { EventEmitter } from "events";

class RabbitMQClient {

    private constructor(){};
    private static instance: RabbitMQClient;
    private isInitialized = false

    private producer! :Producer;
    private consumer! : Consumer;
    private connection!: Connection;
    private producerChannel! : Channel;
    private consumerChannel! : Channel;

    private eventEmitter! : EventEmitter;

    public static getInstance(){
        if(!this.instance){
            this.instance = new RabbitMQClient()
       }
       return this.instance;
    }

    async initialize() {
        if(this.isInitialized){
            return
        }
        try{
            this.connection = await connect(config.rabbitMQ.url)

            this.producerChannel = await this.connection.createChannel()

            this.consumerChannel = await this.connection.createChannel()

            const {queue:replyQueueName} = await this.consumerChannel.assertQueue('',{exclusive:true})

            this.eventEmitter = new EventEmitter();


            this.producer = new Producer(this.producerChannel, replyQueueName, this.eventEmitter);
            console.log("00000000")
            this.consumer = new Consumer(this.consumerChannel, replyQueueName, this.eventEmitter)
            console.log("00000000")

            this.consumer.consumeMesssages()
            console.log("00000000")

            this.isInitialized= true
        }catch(error){
            console.log("rabbit mq error",error)
        }
    }

    async produce(data:any,operation:string){
        if(!this.isInitialized){
            await this.initialize()
        }

        return await this.producer?.produceMessages(data,operation)
    }


}

export default RabbitMQClient.getInstance()
