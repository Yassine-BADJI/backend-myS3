import { Router } from 'express';

import checkJwt from '../../middlewares/checkJwt'
/* API Routes */
import auth from './auth';
import user from './secured/users';
import buckets from './secured/buckets';
import blobs from './secured/blobs';
import render from './render';

const router = Router()

router.use('/auth', auth)
router.use('/users', user)
router.use('/buckets', buckets)
router.use('/blobs', blobs)
router.use('/render', render);

export default router