import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import { NotFoundError, requireAuth, validateRequest } from '@devdezyn/common'
import Product from '../models/product'
import axios from 'axios'

const router = express.Router()

router.post(
  '/api/products/order',
  // requireAuth,
  [
    body('customerId').not().isEmpty().withMessage('User is required'),
    body('productId').not().isEmpty().withMessage('Product is required'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    console.log(req.body)
    const { customerId, productId } = req.body
    const existingProduct = await Product.findById(productId)
    if (!existingProduct) {
      throw new NotFoundError()
    }

    const response = await axios.post(process.env.ORDER_SERVICE as string, {
      customerId,
      product: existingProduct,
    })

    console.log(response)

    // rabbitMQWrapper.channel.sendToQueue(
    //   'ORDER',
    //   Buffer.from(
    //     JSON.stringify({
    //       //   id: existingProduct.id,
    //       //   title: existingProduct.title,
    //       //   price: existingProduct.price,
    //       //   userId: existingProduct.userId,
    //       //   version: existingProduct.version,
    //     })
    //   )
    // )

    res.send({
      status: true,
      data: response.data,
      message: 'Order created successfully',
    })
  }
)

router.post(
  '/api/products/order-with-queue',
  // requireAuth,
  [
    body('customerId').not().isEmpty().withMessage('User is required'),
    body('productId').not().isEmpty().withMessage('Product is required'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { customerId, productId } = req.body

    // rabbitMQWrapper.channel.sendToQueue(
    //   'ORDER',
    //   Buffer.from(
    //     JSON.stringify({
    //       product: existingProduct,
    //       customerId,
    //       amount: existingProduct.price,
    //     })
    //   )
    // )

    // let newOrder

    // rabbitMQWrapper.channel.consume('PRODUCT', async (data: any) => {
    //   console.log('Consuming from PRODUCT Queue')
    //   newOrder = JSON.parse(data.content)
    // })

    res.send({
      status: true,
      // data: newOrder,
      message: 'Order created successfully',
    })
  }
)

export default router
