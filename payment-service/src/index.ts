import mongoose from 'mongoose'
import chalk from 'chalk'
import amqplib from 'amqplib'
import app from './app'

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

    const channel: any = await client.createChannel()

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

    await channel.assertQueue('PAYMENT')

    await channel.consume('PAYMENT', (data: any) => {
      if (data) {
        const payload = JSON.parse(data.content)
        console.log(payload)

        channel.sendToQueue('TRANSACTION', Buffer.from(JSON.stringify(payload)))

        channel.ack(data)
      }
    })

    process.on('SIGINT', () => client.close())
    process.on('SIGTERM', () => client.close())

    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
    console.log(chalk.green('Connected to MongoDb!!!'))
  } catch (error) {
    console.error(chalk.red(error.message))
  }

  app.listen(3000, () => {
    console.log('Payment Service is listening on port 3000!')
  })
}

start()
