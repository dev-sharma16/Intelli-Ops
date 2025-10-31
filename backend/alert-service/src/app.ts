import dotenv from 'dotenv';
dotenv.config();

import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import alertRoutes from './routes/alert.routes'


const app : Application = express();

app.use(cors());
app.use(express.json());

app.use('/api/alert', alertRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Alert service is running just fine!')
})

export default app;