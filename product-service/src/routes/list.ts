import express, { Request, Response } from 'express'
import Product from '../models/product'

const router = express.Router()

router.get('/api/products', async (req: Request, res: Response) => {
  try {
    const products = await Product.find({})

    res.send({
      status: true,
      data: products,
      message: 'Products retrieved successfully',
    })
  } catch (error) {
    console.error(error.message)
  }
})

export default router
