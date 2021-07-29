import express, { Request, Response } from 'express'
import { NotFoundError } from '@devdezyn/common'
import Product from '../models/product'

const router = express.Router()

router.get('/api/products/:id', async (req: Request, res: Response) => {
  const existingProduct = await Product.findById(req.params.id)
  if (!existingProduct) {
    throw new NotFoundError()
  }

  res.send({
    status: true,
    data: existingProduct,
    message: 'Product created successfully',
  })
})

export default router
