import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import { NotFoundError, requireAuth, validateRequest } from '@devdezyn/common'
import Product from '../models/product'
import { rabbitMQWrapper } from '../rabbitmq-wrapper'

const router = express.Router()

router.put(
  '/api/products/order',
  requireAuth,
  [
    body('userId').not().isEmpty().withMessage('User is required is required'),
    body('productId').not().isEmpty().withMessage('Products are required'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { userId, productId } = req.body
    const existingProduct = await Product.findById(productId)
    if (!existingProduct) {
      throw new NotFoundError()
    }

    rabbitMQWrapper.channel.sendToQueue(
      'ORDER',
      Buffer.from(
        JSON.stringify({
          //   id: existingProduct.id,
          //   title: existingProduct.title,
          //   price: existingProduct.price,
          //   userId: existingProduct.userId,
          //   version: existingProduct.version,
        })
      )
    )

    res.send(existingProduct)
  }
)

export default router
