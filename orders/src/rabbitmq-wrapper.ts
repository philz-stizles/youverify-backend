import amqplib, { Connection } from 'amqplib'
// import * as Bluebird from 'bluebird'

class RabbitMQWrapper {
  private _client?: any // Bluebird<Connection>

  get client() {
    if (!this._client) {
      throw new Error('Cannot access RabbitMQ client before connecting')
    }

    return this._client
  }

  async connect(url: string, queueName: string): Promise<void> {
    try {
      this.client.on('connect', () => {
        console.log('Connected to RabbitMQ')
      })

      this.client.on('error', (err: any) => {
        console.log(err.message)
      })

      this._client = await amqplib.connect(url)
      const channel = await this.client.createChannel()
      await channel.assertQueue(queueName)
    } catch (error) {
      console.log(error.message)
    }
  }
}

export const rabbitMQWrapper = new RabbitMQWrapper()
