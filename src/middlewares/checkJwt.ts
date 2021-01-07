import passport from 'passport'
import { NextFunction, Request, Response } from 'express'

function checkJwt() {
  return (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('jwt', (error, user) => {
      console.log(user)
      if (error || !user) {
        return res.status(401).send({ message: "Wrong Token", error })
      }
      next()
    })(req, res, next)
  }
}

export default checkJwt