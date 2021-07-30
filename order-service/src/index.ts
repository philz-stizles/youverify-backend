import mongoose from 'mongoose'
import chalk from 'chalk'
// import amqplib from 'amqplib'
import app from './app'
// import rabbitMQService from './rabbitMQService'
// import Order, { OrderStatus } from './models/order'
// import dotenv from 'dotenv'
import { rabbitMQWrapper } from './rabbitmq-wrapper'

// dotenv.config()

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined')
  }

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined')
  }

  if (!process.env.RabbitMQ_URI) {
    throw new Error('RabbitMQ_URI must be defined')
  }

  try {
    await rabbitMQWrapper.connect(process.env.RabbitMQ_URI, 'ORDER')

    rabbitMQWrapper.client.on('close', () => {
      console.log('RabbitMQ connection closed!')
      process.exit()
    })

    process.on('SIGINT', () => rabbitMQWrapper.client.close())
    process.on('SIGTERM', () => rabbitMQWrapper.client.close())
    // const client = await amqplib.connect(process.env.RabbitMQ_URI)

    // client.on('close', () => {
    //   console.log('RabbitMQ connection closed!')
    //   process.exit()
    // })

    // client.on('connect', () => {
    //   console.log('Connected to RabbitMQ')
    // })

    // client.on('error', (err: any) => {
    //   console.log(err.message)
    // })

    // const channel: any = await client.createChannel()
    // await channel.assertQueue('ORDER')

    // await channel.consume(
    //   'ORDER',
    //   function (msg: any) {
    //     if (msg) {
    //       console.log(msg.content.toString())
    //       channel.ack(msg)
    //       // channel.cancel('myconsumer')
    //     }
    //   }
    //   // { consumerTag: 'myconsumer' }
    // )

    // const channel = rabbitMQService(process.env.RabbitMQ_URI)

    await mongoose.connect(`${process.env.MONGO_URI}/order-service`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
    console.log(chalk.green('Connected to MongoDb!!!'))
  } catch (error) {
    console.error(chalk.red(error.message))
  }

  app.listen(3000, () => {
    console.log('Order Service is listening on port 3000!')
  })
}

start()
