import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import './queue/worker';
import analyseRouter  from './routes/analyse.route';

dotenv.config();

const app : Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/analyse', analyseRouter);

app.get('/', (req: Request, res: Response) => {
  res.send('Ai service is running just fine!')
})

export default app;