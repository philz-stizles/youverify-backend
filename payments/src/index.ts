import mongoose from 'mongoose'
import chalk from 'chalk'
import app from './app'
// import { natsWrapper } from './nats-wrapper'
// import { OrderCreatedListener } from './events/listeners/order-created-listener'
// import { OrderCancelledListener } from './events/listeners/order-cancelled-listener'
// import dotenv from 'dotenv'

// dotenv.config()

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined')
  }

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined')
  }

  // if (!process.env.NATS_CLUSTER_ID) {
  //   throw new Error('NATS_CLUSTER_ID must be defined');
  // }

  // if (!process.env.NATS_CLIENT_ID) {
  //   throw new Error('NATS_CLIENT_ID must be defined');
  // }

  // if (!process.env.NATS_URL) {
  //   throw new Error('NATS_URL must be defined');
  // }

  try {
    // await natsWrapper.connect(
    //   process.env.NATS_CLUSTER_ID,
    //   process.env.NATS_CLIENT_ID,
    //   process.env.NATS_URL
    // );

    // natsWrapper.client.on('close', () => {
    //   console.log('NATS connection closed!');
    //   process.exit();
    // });
    // process.on('SIGINT', () => natsWrapper.client.close());
    // process.on('SIGTERM', () => natsWrapper.client.close());

    // new OrderCreatedListener(natsWrapper.client).listen();
    // new OrderCancelledListener(natsWrapper.client).listen();

    // The domain must be the name of the auth mongo pod service in the kubernetes cluster
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