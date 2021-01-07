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
    app.use((request, res, next) => {
        request.dbConnection = connection
        next()
    })

    app.use('/api', api)
    console.log("Server listening on port " + process.env.PORT + " !");
    app.listen(process.env.PORT || 5000);
}).catch(error => console.log(error));
