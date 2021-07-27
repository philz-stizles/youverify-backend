import express, { Request, Response } from 'express'
import Product from '../models/product'

const router = express.Router()

router.get('/api/products', async (req: Request, res: Response) => {
  // Only show tickets that have not been ordered for, or on which orders have been cancelled
  const products = await Product.find({ orderId: undefined })

  res.send(products)
})

export default router
