
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

     name: {

        type: String,
        required: true,
        trim: true,
     },

     email: {

         type: String,
         required: true,
         trim: true,
         lowerCase: true,
         unique: true
     },

     password: {

         type: String,
         required: true,
         select: false,
     }


}, {timestamps: true})


export const User = mongoose.model("User", userSchema);