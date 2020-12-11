import {Request, Response, Router} from 'express'
import passwordHash from 'password-hash'
import {User} from "../../../entity/User";
import {getManager} from "typeorm";
import { v4 as uuidv4 } from 'uuid';


const router = Router();

// :: GET /api/users > Get All Users
router.get('/', (_, response) => {
  response.json({
    users: [],
  })
});




export default router