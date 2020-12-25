import { Router } from 'express';

import checkJwt from '../../middlewares/checkJwt'
/* API Routes */
import auth from './auth';
import user from './secured/users';
import storage from './secured/storage';
import render from './render';

const router = Router()

router.use('/auth', auth)
router.use('/users', user)
router.use('/storage', storage)
router.use('/render', render);

export default router