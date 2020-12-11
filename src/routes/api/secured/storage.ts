import { Router, Request, Response } from 'express'
import aws from 'aws-sdk';

const router = Router()
aws.config.update({
    accessKeyId: process.env.aws_access_key_id,
    secretAccessKey: process.env.aws_secret_access_key,
    region: process.env.aws_s3_region
})
const s3 = new aws.S3();
router.get('/buckets', (req, res) => {
    s3.listBuckets((err, data) => {
        if (err) {
            res.status(500).send({ message: "Failed", error: err });
        } else {
            res.status(200).send({ message: "Success", data: data });
        }
    });
});
router.get('/bucket/:bucket_name', (req: Request, res: Response) => {
    s3.listObjects({ Bucket: req.params.bucket_name }, (err, data) => {
        if (err) {
            res.status(500).send({ message: "Failed", error: err });
        } else {
            res.status(200).send({ message: "Success", data: data });
        }
    });
});
router.post('/bucket', (req: Request, res: Response) => {
    s3.createBucket({ Bucket: req.body.bucket_name }, function (err, data) {
        if (err) {
            res.status(500).send({ message: "Failed", error: err });
        } else {
            res.status(200).send({ message: "Success", data: data });
        }
    });
});
router.delete('/bucket/:bucket_name', (req: Request, res: Response) => {
    s3.deleteBucket({ Bucket: req.params.bucket_name }, function (err) {
        if (err) {
            res.status(500).send({ message: "Failed", error: err });
        } else {
            res.status(200).send({ message: "Success" });
        }
    });
});
router.post('/bucket_folder', (req: Request, res: Response) => {
    s3.putObject({ Key: req.body.folder_name + "/", Bucket: req.body.bucket_name }, function (err, data) {
        if (err) {
            res.status(500).send({ message: "Failed", error: err });
        } else {
            res.status(200).send({ message: "Success", data: data });
        }
    });
});

export default router