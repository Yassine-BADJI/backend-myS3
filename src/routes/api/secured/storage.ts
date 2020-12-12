import { Router, Request, Response } from 'express'
import AWS from 'aws-sdk';
import multer from 'multer';
import multerS3 from 'multer-s3';

const router = Router()
AWS.config.update({
    accessKeyId: 'AKIAIP7CVXNHYUH5POBQ',
    secretAccessKey: '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',
    region: 'eu-west-3'
})
const s3 = new AWS.S3();
const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'sanvoisinstest',
        key: function (req, file, cb) {
            console.log(file);
            cb(null, 'test/test.pdf');
        }
    })
});

router.get('/', (req, res) => {
    console.log(process.env.aws_access_key_id)
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
router.post('/upload', upload.single('file'), function (req, res, next) {
    console.log(req.files);
    res.send("Uploaded!");
});

export default router