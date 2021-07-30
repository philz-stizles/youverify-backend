import mongoose from 'mongoose'
import chalk from 'chalk'
import app from './app'
import { seedUsers } from './models/seeder'
// import dotenv from 'dotenv'

// dotenv.config()

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined')
  }

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined')
  }

  try {
    // The domain must be the name of the auth mongo pod service in the kubernetes cluster
    await mongoose.connect(`${process.env.MONGO_URI}/customer-service`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
    console.log(chalk.green('Connected to MongoDb!!!'))

    // Seed product data
    await seedUsers()
  } catch (error) {
    console.error(chalk.red(error.message))
  }

  app.listen(3000, () => {
    console.log(chalk.green('Customer Service is listening on port 3000!'))
  })
}

start()
