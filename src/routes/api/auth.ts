import { Request, Response, Router } from 'express'
import passport from 'passport'
import jwt from 'jsonwebtoken'
import passwordHash from "password-hash";
import { v4 as uuidv4 } from "uuid";
import { User } from "../../entity/User";
import { getRepository } from "typeorm";

const router = Router();

router.post('/login', (request, response, next) => {
  passport.authenticate('local', (error, user) => {
    if (error || !user) {
      return response
        .status(404)
        .json({ error })
    }

    const token = jwt.sign(user, 'secret');

    response.json({ token })
  })(request, response, next)
});

// :: POST /api/users > Inscription user
router.post('/sign-up', async (req: Request, res: Response) => {
  const hashedPassword = passwordHash.generate(req.body.password);
  const user = new User();
  user.uuid = uuidv4();
  user.nickname = req.body.nickname;
  user.email = req.body.email;
  user.password = hashedPassword;
  const userRepository = getRepository(User);
  const users = await userRepository.find();
  await userRepository.save(user);
  res.status(200).send({ message: "Create", users, userCreated: user });
});

export default router
