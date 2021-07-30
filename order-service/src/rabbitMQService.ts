import amqplib from 'amqplib'

export const rabbitMQService = async (url: string) => {
  const client = await amqplib.connect(url)

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
  await channel.assertQueue('ORDER')

  process.on('SIGINT', () => client.close())
  process.on('SIGTERM', () => client.close())

  return channel
}

export default rabbitMQService
