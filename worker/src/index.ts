import mongoose from 'mongoose'
import chalk from 'chalk'
import amqplib from 'amqplib'
import { v4 as uuidV4 } from 'uuid'
import Transaction from './models/transaction'

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
    await channel.assertQueue('TRANSACTION')

    await channel.consume('TRANSACTION', async (data: any) => {
      if (data) {
        console.log(data.content.toString())
        const { customerId, product, order } = data.content
        // Build the transaction from queue and save it to the database
        const newTransaction = Transaction.build({
          transactionRef: uuidV4(),
          customerId,
          productId: product.id,
          orderId: order.id,
          totalAmount: product.price,
        })
        await newTransaction.save()

        console.log(
          `Transaction with order id ${order.id} belonging to customer ${customerId} 
          as been saved to the DB with Transaction ref ${newTransaction.transactionRef}.`
        )

        channel.ack(data)
      }
    })

    process.on('SIGINT', () => client.close())
    process.on('SIGTERM', () => client.close())

    await mongoose.connect(`${process.env.MONGO_URI}/transaction-service`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
    console.log(chalk.green('Connected to MongoDb!!!'))
  } catch (error) {
    console.error(chalk.red(error.message))
  }
}

start()
