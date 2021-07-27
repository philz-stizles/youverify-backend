import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import { BadRequestError, requireAuth, validateRequest } from '@devdezyn/common'
import Product from '../models/product'
// import { ProductCreatedPublisher } from '../events/publishers/Product-created-publisher'
// import { natsWrapper } from '../nats-wrapper'

const router = express.Router()

router.post(
  '/api/products',
  requireAuth,
  [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price must be greater than zero(0)'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title } = req.body

    const existingProduct = await Product.findOne({ title })
    if (existingProduct) {
      throw new BadRequestError('Title already exists')
    }

    const newProduct = new Product(req.body)
    await newProduct.save()
    // await new ProductCreatedPublisher(natsWrapper.client).publish({
    //   id: newProduct.id,
    //   title: newProduct.title,
    //   price: newProduct.price,
    //   userId: newProduct.userId,
    //   version: newProduct.version,
    // })

    res.status(201).send(newProduct)
  }
)

export default router
