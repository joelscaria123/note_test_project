
import mongoose from "mongoose";
import "dotenv/config";

const connectDB = async () => {

    try{

        await mongoose.connect(process.env.DB_URL);
        console.log("MongoDB connected Successfully");

    }

    catch(error){

        console.log("MongoDB connection failed:", error.message);
        process.exit(1);

    }
}

export default connectDB;