import { Router } from 'express'
import passport from 'passport'
import jwt from 'jsonwebtoken'

const router = Router()

router.post('/login', (request, response, next) => {
  passport.authenticate('local', (error, user) => {
    if (error || !user) {
      return response
        .status(404)
        .json({ error })
    }

    const token = jwt.sign(user, 'secret')

    response.json({ token })
  })(request, response, next)
})

export default router
