import User from './user'

const users = [
  {
    email: 'johndoe@testing.com',
    password: 'p@ssw0rd',
  },
  {
    email: 'admin@testing.com',
    password: 'p@ssw0rd',
  },
]

export const seedUsers = async () => {
  try {
    const count = await User.countDocuments()
    if (count <= 0) {
      for (const user of users) {
        const newUser = User.build(user)
        await newUser.save()
      }

      console.log('Database seeded successfully!!')
    } else {
      console.log('Users in database!!')
    }
  } catch (error) {
    console.log('Database seeding failed', error.message)
  }
}
