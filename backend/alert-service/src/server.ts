import app from './app'
import { connectDB } from './db/db'

connectDB();

app.listen(process.env.PORT,()=>{
    console.log('Alert Service is running on PORT : '+process.env.PORT);
})