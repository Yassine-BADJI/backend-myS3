import "reflect-metadata";
import { createConnection } from "typeorm";
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import passport from "passport";
import './middlewares/passport';
import api from './routes/api'

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(morgan("tiny"));
app.use(passport.initialize());

createConnection().then(async connection => {
    app.use('/api', api)

    // console.log("Inserting a new user into the database...");
    // const user = new User();
    // user.uuid = uuidv4();
    // user.nickname = "Sanvoisins";
    // user.email = "sanvoisins@outlook.fr";
    // user.password = "test";
    // await connection.manager.save(user);
    // console.log("Saved a new user with id: " + user.uuid);

    // console.log("Loading users from the database...");
    // const users = await connection.manager.find(User);
    // console.log("Loaded users: ", users);

    // app.get("/", (req: Request, res: Response) => {
    //     res.send("my S3")
    // })
    app.listen(process.env.api_port);

    console.log("Server listening on port " + process.env.api_port + "!");

}).catch(error => console.log(error));
