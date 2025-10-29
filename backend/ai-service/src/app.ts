import dotenv from 'dotenv';
dotenv.config();

import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import './queue/worker';
import analyseRouter  from './routes/analyse.route';


const app : Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/analyse', analyseRouter);

app.get('/', (req: Request, res: Response) => {
  res.send('Ai service is running just fine!')
})

export default app;