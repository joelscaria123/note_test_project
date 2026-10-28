
import express from "express";
import dotenv from "dotenv";
import notesRoutes from "./routes/notesRoutes.js";
import connectDB from "./config/db.js";

dotenv.config({ quiet: true})

const app = express();
const PORT = process.env.PORT;

app.use(express.json());

app.use("/api/notes", notesRoutes);


const startServer = async() => {

    try{

        await connectDB();
        app.listen(PORT, () => {

        console.log(`Server running on PORT`, PORT)
       })

    }

    catch(error){
 
         console.log("Error in startServer", error);
    }
}


startServer();