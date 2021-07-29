import chalk from 'chalk'
import Product from './product'

const products = [
  {
    title: 'HP Omen Laptop',
    description: 'High-end gaming laptop',
    price: 650000,
    quantity: 4,
    shipping: true,
  },
  {
    title: 'Huawei mobile phone',
    description: 'Smart phone with gorilla screen',
    price: 120000,
    quantity: 10,
    shipping: true,
  },
]

export const seedProducts = async () => {
  try {
    const count = await Product.countDocuments()
    if (count <= 0) {
      for (const product of products) {
        const newProduct = Product.build(product)
        await newProduct.save()
      }

      console.log(chalk.green('Database seeded successfully!!'))
    } else {
      console.log(chalk.green('Products in database!!'))
    }
  } catch (error) {
    console.log(chalk.green('Database seeding failed', error.message))
  }
}
