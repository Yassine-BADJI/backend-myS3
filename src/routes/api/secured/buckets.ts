import { Router, Request, Response } from 'express'
import AWS from 'aws-sdk';
import multer from 'multer';
import multerS3 from 'multer-s3';
import { v4 as uuidv4 } from 'uuid';
import { createQueryBuilder, getRepository } from "typeorm";
import { Bucket } from "../../../entity/Bucket";
import { Blob } from "../../../entity/Blob";

const router = Router()
AWS.config.update({
    accessKeyId: 'AKIAIP7CVXNHYUH5POBQ',
    secretAccessKey: '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',
    region: 'eu-west-3'
})
const s3 = new AWS.S3();
router.get('/user/:uuid_user', async (req, res) => {
    const buckets = await getRepository(Bucket)
        .createQueryBuilder("bucket")
        .leftJoinAndSelect("bucket.blobs", "blob")
        .where("bucket.uuid_user = :uuid_user", { uuid_user: req.params.uuid_user })
        .getMany();
    res.send(buckets)
});
router.post('/', (req: Request, res: Response) => {
    s3.putObject({ Key: req.body.user_uuid + "/" + req.body.bucket_name + "/", Bucket: process.env.aws_s3_bucket }, async function (err, data) {
        if (err) {
            res.status(500).send({ success: false, error: err });
        } else {
            res.status(200).send({ success: true, data: data });
            const new_bucket = new Bucket();
            new_bucket.uuid = uuidv4();
            new_bucket.name = req.body.bucket_name
            new_bucket.uuid_user = req.body.user_uuid
            await new_bucket.save();
        }
    });
});
router.get('/:uid_bucket', async (req: Request, res: Response) => {
    const bucket = await getRepository(Bucket)
        .createQueryBuilder("bucket")
        .where("bucket.uuid = :uuid_bucket", { uuid_bucket: req.params.uuid_bucket })
        .getOne();
    res.send(bucket)
})
router.delete('/:uuid_bucket', async (req: Request, res: Response) => {
    const bucket = await getRepository(Bucket)
        .createQueryBuilder("bucket")
        .where("bucket.uuid = :uuid", { uuid: req.params.uuid_bucket })
        .getOne();
    const params = {
        Bucket: process.env.aws_s3_bucket,
        Key: bucket.uuid_user + "/" + bucket.name + "/"
    }
    console.log(params)
    s3.deleteObject(params, (err, data) => {
        if (err) {
            res.status(401).send({ success: false, err })
        } else {
            res.status(200).send({ success: true, data })
            const status = getRepository(Bucket).delete({ uuid: req.params.uuid_bucket })
        }
    });
});
router.put('/:bucket_uuid', async (req: Request, res: Response) => {
    const bucket = await getRepository(Bucket)
        .createQueryBuilder("bucket")
        .where("bucket.uuid = :uuid", { uuid: req.params.uuid_bucket })
        .getOne();
    const params = {
        Bucket: process.env.aws_s3_bucket,
        CopySource: bucket.uuid_user + "/ " + bucket.name + "/",
        Key: bucket.uuid_user + "/ " + req.body.new_name + "/"
    }
    s3.copyObject(params, (err, data) => {
        if (err) {
            res.status(401).send({ message: "Object not deleted", err })
        } else {
            s3.deleteObject(params, (err, data) => {
                if (err) {
                    res.status(401).send({ success: false, err })
                } else {
                    res.status(200).send({ success: true, data })
                    const status = getRepository(Bucket).save({ uuid: req.params.bucket_uuid, name: req.body.new_name })
                }
            });
        }
    })
})

export default router