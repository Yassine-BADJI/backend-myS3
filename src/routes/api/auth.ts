import { Request, Response, Router } from 'express'
import passport from 'passport'
import jwt from 'jsonwebtoken'
import passwordHash from "password-hash";
import { v4 as uuidv4 } from "uuid";
import { User } from "../../entity/User";
import { getRepository } from "typeorm";

const router = Router();

router.post('/login', (req: Request, res: Response, next) => {
  passport.authenticate('local', (error, user) => {
    if (error || !user) {
      return res.status(404).send({error});
    }
    const token = jwt.sign({user}, 'secret');
    res.setHeader("token", token);
    return res.status(200).send();
  })(req, res, next)
});

// :: POST /api/users > Inscription user
router.post('/sign-up', async (req: Request, res: Response) => {
  const hashedPassword = passwordHash.generate(req.body.password);
  const newUser = new User();
  newUser.uuid = uuidv4();
  newUser.nickname = req.body.nickname;
  newUser.email = req.body.email;
  newUser.password = hashedPassword;
  await getRepository(User).save(newUser);
  return res.status(200).send();
});

export default router
