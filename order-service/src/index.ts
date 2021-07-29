import mongoose from 'mongoose'
import chalk from 'chalk'
import app from './app'
import { rabbitMQWrapper } from './rabbitmq-wrapper'
// import dotenv from 'dotenv'

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
