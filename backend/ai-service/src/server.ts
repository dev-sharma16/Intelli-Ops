import app from './app'
import { connectDB } from './db/db'
import './queue/worker';

connectDB();

app.listen(process.env.PORT,()=>{
    console.log('Ai Service is running on Port '+process.env.PORT);
})