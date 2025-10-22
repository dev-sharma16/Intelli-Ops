import app from "./app";
import { connectDB } from "./db/db"

const PORT = process.env.PORT || 3001;

connectDB();

app.listen(PORT, ()=>{
    console.log("Server is started in PORT :",PORT)
})