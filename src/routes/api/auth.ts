import { Request, Response, Router } from 'express'
import passport from 'passport'
import jwt from 'jsonwebtoken'
import AWS from 'aws-sdk';
import passwordHash from "password-hash";
import { Bucket } from "../../entity/Bucket";
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
  s3.putObject({ Key: new_user.uuid + "/", Bucket: process.env.aws_s3_bucket }, async function (err, data) {
    if (err) {
      res.status(500).send({ success: false, error: err });
    } else {
      res.status(200).send({ success: true, data: data });
      const new_bucket = new Bucket();
      new_bucket.uuid = uuidv4();
      new_bucket.name = new_user.uuid
      new_bucket.uuid_user = new_user.uuid
      await new_bucket.save();
    }
  });
});

export default router
