import { Request, Response, Router } from 'express'
import passport from 'passport'
import jwt from 'jsonwebtoken'
import AWS from 'aws-sdk';
import passwordHash from "password-hash";
import { v4 as uuidv4 } from "uuid";
import { User } from "../../entity/User";
import { getRepository } from "typeorm";

const router = Router();
AWS.config.update({
  accessKeyId: 'AKIAIP7CVXNHYUH5POBQ',
  secretAccessKey: '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',
  region: 'eu-west-3'
})
const s3 = new AWS.S3();
router.post('/login', (req: Request, res: Response, next) => {
  passport.authenticate('local', (error, user) => {
    if (error || !user) {
      return res.status(404).send({ error });
    }
    const token = jwt.sign({ user }, 'secret');
    res.setHeader("token", token);
    return res.status(200).send({ token, uuid: user.uuid, success: true });
  })(req, res, next)
});

// :: POST /api/users > Inscription user
router.post('/sign-up', async (req: Request, res: Response) => {
  const hashedPassword = passwordHash.generate(req.body.password);
  const new_user = new User();
  new_user.uuid = uuidv4();
  new_user.nickname = req.body.nickname;
  new_user.email = req.body.email;
  new_user.password = hashedPassword;
  await getRepository(User).save(new_user);
  s3.createBucket({ Bucket: new_user.uuid }, function (err, data) {
    if (err) {
      return res.status(403).send({ success: false, error: err });
    } else {
      return res.status(200).send({ message: "Hello " + new_user.nickname, success: true });
    }
  });
});

export default router
