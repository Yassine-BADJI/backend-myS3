import { Router, Request, Response, json } from 'express'
import AWS from 'aws-sdk';
import multer from 'multer';
import multerS3 from 'multer-s3';
import { v4 as uuidv4 } from 'uuid';
import { getRepository, createQueryBuilder } from "typeorm";
import { Bucket } from "../../../entity/Bucket";
import { Blob } from "../../../entity/Blob";

const router = Router()
AWS.config.update({
  accessKeyId: 'AKIAIP7CVXNHYUH5POBQ',
  secretAccessKey: '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',
  region: 'eu-west-3'
})
const aws_base_url = "https://efrei-mys3.s3.eu-west-3.amazonaws.com/"
const s3 = new AWS.S3();
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'efrei-mys3',
    key: async function (req: Request, file, cb) {
      const bucket = await getRepository(Bucket)
        .createQueryBuilder("bucket")
        .where("bucket.uuid = :uuid_bucket", { uuid_bucket: req.params.bucket_uuid })
        .getOne();
      console.log(bucket)
      const new_blob = new Blob();
      new_blob.uuid = uuidv4();
      new_blob.name = file.originalname.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s/g, '')
      new_blob.bucket = bucket
      if (bucket.uuid_user === bucket.name) {
        cb(null, bucket.name + "/" + new_blob.name);
        new_blob.url = aws_base_url + bucket.name + "/" + new_blob.name
      } else {
        cb(null, bucket.uuid_user + "/" + bucket.name + "/" + new_blob.name);
        new_blob.url = aws_base_url + bucket.uuid_user + "/" + bucket.name + "/" + new_blob.name
      }
      await new_blob.save();
    }
  })
});
router.get('/:blob_uuid', async (req: Request, res: Response) => {
  const blob = await getRepository(Blob)
    .createQueryBuilder("blob")
    .where("blob.uuid = :blob_uuid", { blob_uuid: req.params.blob_uuid })
    .getOne();
  res.send(blob)
})
router.delete('/:blob_uuid', async (req: Request, res: Response) => {
  const blob = await getRepository(Blob)
    .createQueryBuilder("blob")
    .leftJoinAndSelect("blob.bucket", "bucket")
    .where("blob.uuid = :blob_uuid", { blob_uuid: req.params.blob_uuid })
    .getOne();
  const params = {
    Bucket: blob.bucket.uuid_user,
    Key: blob.bucket.name + "/" + blob.name
  }
  s3.deleteObject(params, (err, data) => {
    if (err) {
      res.status(401).send({ success: false, err })
    } else {
      res.status(200).send({ success: true, data })
      const status = getRepository(Blob).delete({ uuid: req.params.blob_uuid })
    }
  });
});
router.put('/:blob_uuid', async (req: Request, res: Response) => {
  const blob = await getRepository(Blob)
    .createQueryBuilder("blob")
    .leftJoinAndSelect("blob.bucket", "bucket")
    .where("blob.uuid = :blob_uuid", { blob_uuid: req.params.blob_uuid })
    .getOne();
  console.log(req.body.new_name)
  const params = {
    Bucket: blob.bucket.uuid_user,
    CopySource: blob.bucket.name + "/" + blob.name,
    Key: req.body.new_name
  }
  s3.copyObject(params, (err, data) => {
    if (err) {
      res.status(403).send({ success: false, err })
    } else {
      s3.deleteObject(params, (err, data) => {
        if (err) {
          res.status(401).send({ success: false, err })
        } else {
          res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
          res.status(200).send({ success: true, data })
          const status = getRepository(Blob).save({ uuid: req.params.blob_uuid, name: req.body.new_name })
        }
      });
    }
  })
})
router.post('/:bucket_uuid', upload.single('file'), function (req, res, next) {
  res.send("Uploaded!");
});
export default router