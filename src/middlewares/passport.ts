import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import { ExtractJwt, Strategy as JsonWebTokenStrategy } from 'passport-jwt'

import { getRepository } from "typeorm";
import { User } from "../entity/User";
import passwordHash from "password-hash";

passport.use(
    new LocalStrategy({
        usernameField: "email",
        passwordField: "password",
    },
        function (email, password, done) {
            getRepository(User).findOne({ email: email }).then((user) => {
                if (!user) { return done('No user found', false); }
                const check_password = passwordHash.verify(password, user.password);
                if (!check_password) { return done('Wrong credentials', false); }
                return done(null, user);
            });
        }
    ));


passport.use(
    new JsonWebTokenStrategy({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: 'secret',
    },
        function (jwt_payload, done) {
            console.log(jwt_payload)
            getRepository(User).findOne({ email: jwt_payload.user.email }).then((user) => {
                if (user) {
                    return done(null, user);
                }
                if (!user) {
                    return done("Token invalid", false);
                }
            });
        }
    )
);
