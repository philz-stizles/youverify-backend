import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import { validateRequest, OrderStatus } from '@devdezyn/common'
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

    console.log(req.body)

    // Build the order and save it to the database
    const newOrder = Order.build({
      status: OrderStatus.Created,
      customerId,
      productId: product.id,
      price: product.price,
    })
    await newOrder.save()

    const createdOrder = {
      order: {
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
    }

    rabbitMQWrapper.channel.sendToQueue(
      'PAYMENT',
      Buffer.from(JSON.stringify(createdOrder))
    )

    res.status(201).send(createdOrder)
  }
)

export { router as createOrderRouter }
