import {Request, Response, Router} from 'express'
import {getRepository} from "typeorm";
import {User} from "../../../entity/User";
import passwordHash from "password-hash";


const router = Router();

// :: GET /api/users > Get All Users
router.get('/', async (req: Request, res: Response) => {
  const users = await getRepository(User).find();
  return res.status(200).send({users});
});

// :: GET /api/:uuid > Get User by Uuid
router.get('/:uuid', async (req: Request, res: Response) => {
  try {
    const results = await getRepository(User).findOneOrFail(req.params.uuid);
    return res.status(200).send({results});
  }
  catch (error){
    res.status(404).send("User Not Found")
  }
});

// :: PUT /api/:uuid > Put User by Uuid
router.put('/:uuid', async (req: Request, res: Response) => {
  const {nickname, email, password} = req.body;
  try {
    const user = await getRepository(User).findOneOrFail(req.params.uuid);
    const hashedPassword = passwordHash.generate(password);
    console.log(nickname, email, password)
    user.nickname = nickname;
    user.email = email;
    user.password =  hashedPassword;
    await getRepository(User).save(user);
    return res.status(200).send("User updated");
  }
  catch (error){
    return res.status(404).send("User Not Found");
  }
});

// :: DELETE /api/:uuid > Delete User by Uuid
router.delete('/:uuid', async (req: Request, res: Response) => {
  const results = await getRepository(User).delete(req.params.uuid);
  return res.status(200).send({results});
});


export default router