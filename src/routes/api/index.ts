import { Router } from 'express';

import checkJwt from '../../middlewares/checkJwt'
/* API Routes */
import auth from './auth';
import user from './secured/users';
import buckets from './secured/buckets';
import blobs from './secured/blobs';

const router = Router()

router.use('/auth', auth)
router.use('/users', checkJwt(), user)
router.use('/buckets', checkJwt(), buckets)
router.use('/blobs', checkJwt(), blobs)

export default router