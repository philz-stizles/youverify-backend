import mongoose from 'mongoose'
import chalk from 'chalk'
import amqplib from 'amqplib'
import dotenv from 'dotenv'
import app from './app'
import { seedProducts } from './models/seeder'

dotenv.config()

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
    const client = await amqplib.connect(process.env.RabbitMQ_URI)

    client.on('close', () => {
      console.log('RabbitMQ connection closed!')
      process.exit()
    })

    client.on('connect', () => {
      console.log('Connected to RabbitMQ')
    })

    client.on('error', (err: any) => {
      console.log(err.message)
    })

    const channel: any = await client.createChannel()
    await channel.assertQueue('PRODUCT')

    await channel.consume(
      'PRODUCT',
      function (msg: any) {
        if (msg) {
          console.log(msg.content.toString())
          channel.ack(msg)
          // channel.cancel('myconsumer')
        }
      }
      // { consumerTag: 'myconsumer' }
    )

    process.on('SIGINT', () => client.close())
    process.on('SIGTERM', () => client.close())

    await mongoose.connect(`${process.env.MONGO_URI}/product-service`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
    console.log(chalk.green('Connected to MongoDb!!!'))

    // Seed product data
    await seedProducts()
  } catch (error) {
    console.error(chalk.red(error.message))
  }

  app.listen(3000, () => {
    console.log(chalk.green('Product Service is listening on port 3000!'))
  })
}

start()
