import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import alertRoutes from './routes/alert.routes'

dotenv.config();

const app : Application = express();

app.use(cors());
app.use(express.json());

app.use('/api/alert', alertRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Auth service is running just fine!')
})

export default app;