import 'dotenv/config'

export default {
    rabbitMQ:{
        url: String(process.env.RABBITMQ_CLOUD_URL),
        queues:{
            courseQueue: "course_queue",
            orderQueue: "order_queue"
        }
    }
}