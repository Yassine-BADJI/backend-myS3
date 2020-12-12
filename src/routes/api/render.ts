import { Router } from 'express';

const router = Router();

router.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');//index.html is inside node-cheat
});
export default router