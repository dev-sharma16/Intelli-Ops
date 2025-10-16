import app from './app'
import { connectDB } from './db/db'

connectDB();

app.listen(process.env.PORT,()=>{
    console.log('Auth Service is running on Port '+process.env.PORT);
})