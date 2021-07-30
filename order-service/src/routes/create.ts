import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import {
  NotFoundError,
  requireAuth,
  validateRequest,
  OrderStatus,
  BadRequestError,
} from '@devdezyn/common'
import Order from '../models/order'
import { rabbitMQWrapper } from './../rabbitmq-wrapper'

const router = express.Router()

router.post(
  '/api/orders',
  // requireAuth,
  [
    body('customerId')
      .not()
      .isEmpty()
      .withMessage('Customer details is required'),
    body('product').not().isEmpty().withMessage('Product details is required'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { customerId, product } = req.body

    // Build the order and save it to the database
    const newOrder = Order.build({
      status: OrderStatus.Created,
      customerId,
      productId: product.id,
      price: product.price,
    })
    await newOrder.save()

    rabbitMQWrapper.channel.sendToQueue(
      'PAYMENT',
      Buffer.from(
        JSON.stringify({
          orderId: {
            id: newOrder.id,
            createdAt: newOrder.createdAt,
          },
          customerId,
          product: {
            id: product.id,
            title: product.title,
            description: product.description,
            price: product.price,
          },
        })
      )
    )

    // Publish an event saying that an order was created
    // await new OrderCreatedPublisher(natsWrapper.client).publish({
    //   id: newOrder.id,
    //   version: newOrder.version,
    //   status: newOrder.status,
    //   expiresAt: newOrder.expiresAt.toISOString(),
    //   userId: newOrder.userId,
    //   ticket: {
    //     id: existingTicket.id,
    //     price: existingTicket.price,
    //   },
    // })

    res.status(201).send(newOrder)
  }
)

export { router as createOrderRouter }
