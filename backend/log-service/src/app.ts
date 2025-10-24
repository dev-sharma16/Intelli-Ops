import express, { Application } from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv"
import logRoutes from "./routes/log.routes"

dotenv.config();

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/logs', logRoutes);

app.get('/', (_req, res) => res.send('Log Service is running.!'));

export default app;