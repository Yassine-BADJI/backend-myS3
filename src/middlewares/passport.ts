import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import { Strategy as JsonWebTokenStrategy, ExtractJwt } from 'passport-jwt'

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    (email, password, done) => {
      if (email === 'test@hotmail.fr' && password === 'test') {
        done(null, { email: 'test@hotmail.fr' })
      } else {
        done('Wrong credentials', null)
      }
    }
  )
)

passport.use(
  new JsonWebTokenStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'secret',
    },
    (
      user: { email: string },
      done,
    ) => {
      if (user.email !== 'test@hotmail.fr') {
        done('Wrong API Token', null)
      } else {
        done(null, user)
      }
    }
  )
)
