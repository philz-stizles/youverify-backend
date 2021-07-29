import express from 'express'
import 'express-async-errors'
import cookieSession from 'cookie-session'
import { currentUser, errorHandler, NotFoundError } from '@devdezyn/common'
import createProductRouter from './routes/create'
import readProductRouter from './routes/read'
import listProductRouter from './routes/list'
import updateProductRouter from './routes/update'
import placeOrderRouter from './routes/place-order'

const app = express()

app.set('trust proxy', 1)

app.use(express.json())

app.use(
  cookieSession({
    // name: 'session',
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
)

app.use(currentUser)

app.use(createProductRouter)
app.use(readProductRouter)
app.use(listProductRouter)
app.use(updateProductRouter)
app.use(placeOrderRouter)

app.all('*', async () => {
  throw new NotFoundError()
})

app.use(errorHandler)

export default app
