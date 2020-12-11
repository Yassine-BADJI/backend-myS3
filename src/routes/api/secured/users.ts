import { Router } from 'express'

const router = Router()

// :: GET /api/users > Get All Users
router.get('/', (_, response) => {
  response.json({
    users: [],
  })
})

export default router