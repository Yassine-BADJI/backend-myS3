import passport from 'passport'

function checkJwt() {
  return (request: any, response: any, next: any) => {
    passport.authenticate('jwt', (error, user) => {
      if (error || !user) {
        return response
          .status(401)
          .json({ error })
      }

      next()
    })(request, response, next)
  }
}

export default checkJwt