import express from 'express'
import { currentUser, BadRequestError } from '@devdezyn/common'
import User from '../models/user'

const router = express.Router()

router.get('/api/users/currentuser', currentUser, (req, res) => {
  res.send({ currentUser: req.currentUser || null })
})

router.get('/api/users/:email', currentUser, async (req, res) => {
  const { email } = req.params

  const existingUser = await User.findOne({ email })
  if (!existingUser) {
    throw new BadRequestError('Invalid credentials')
  }

  res.send({
    status: true,
    data: existingUser,
    message: 'User profile retrieved successfully',
  })
})

export { router as currentUserRouter }
