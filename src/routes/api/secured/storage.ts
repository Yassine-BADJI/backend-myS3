import { Router, Request, Response } from 'express'
import AWS from 'aws-sdk';
import multer from 'multer';
import multerS3 from 'multer-s3';
import { format_storage } from '../../../helpers/storage';

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
        bucket: 'efrei-mys3',
        key: function (req, file, cb) {
            console.log(file);
            cb(null, 'test.pdf');
        }
    })
});

router.get('/', (req, res) => {
    s3.listBuckets((err, data) => {
        if (err) {
            res.status(500).send({ message: "Failed", error: err });
        } else {
            res.status(200).send({ message: "Success", data: data });
        }
    });
});
router.get('/:bucket_name', (req: Request, res: Response) => {
    s3.listObjects({ Bucket: req.params.bucket_name }, (err, data) => {
        if (err) {
            res.status(500).send({ message: "Failed", error: err });
        } else {
            const storage = format_storage(data);
            res.status(200).send({ message: "Success", data: data });
        }
    });
});

router.post('/', (req: Request, res: Response) => {
    s3.createBucket({ Bucket: req.body.bucket_name, ACL: 'public-read' }, function (err, data) {
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
//create_folder
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