import { Router } from 'express';

import checkJwt from '../../middlewares/checkJwt'
/* API Routes */
import auth from './auth';
import user from './secured/users';
import storage from './secured/storage';
import render from './render';

const router = Router()

router.use('/auth', auth)
router.use('/users', checkJwt(), user)
router.use('/storage', checkJwt(), storage)

export default router