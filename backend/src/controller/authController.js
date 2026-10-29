import { User } from "../models/User.js";
import bcrypt, { hash } from "bcrypt";
import validator from "validator";
import jwt from "jsonwebtoken";
import "dotenv/config";

export const signup = async (req,res) => {

     try{


        const {name, email, password} = req.body;


        if(typeof name!== "string" ||
           typeof email!== "string" ||
           typeof password!== "string"){

           
            return res.status(400).json({

                message: "Name, email and password must be provided as text"
            })
        }


        const editedName = name.trim();

        const editedEmail = email.trim().toLocaleLowerCase();


        if(!editedName){

            return res.status(400).json({message: "Name is required"})
        }

        if(!editedEmail){

            return res.status(400).json({message: "Email is required"})
        }

        if(!password){
            
            return res.status(400).json({ message: "Password is required"});
        }

        if(!validator.isEmail(editedEmail)){

          return res.status(400).json({

             message: "Please enter a valid email address"
          })

        }


        if(password.length <8){

            return res.status(400).json({
                message: "Password must be at least 8 characters long"
            })
        }


        const isUserAlreadyExists = await User.findOne({email: editedEmail});

        if(isUserAlreadyExists){

            return res.status(409).json({ message: "User already exists. Login Instead"})
        }



        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = {

            name: name,
            email: email,
            password: hashedPassword,
        }

        await User.create(newUser);

        return res.status(201).json({
            message: "New User added Successfully",
            newUser
        })


     }

     catch(error){

        console.log("Error in signup controller", error);
        return res.status(500).json({
            message: "Internal Server Error"
        })

     }
}


export const login = async (req,res) => {

     try{

        const {email, password} = req.body;

        if(typeof email!=="string" || typeof password!== "string"){

            return res.status(400).json({
                message: "Email and password must be provided as text"
            })
        }

        const editedEmail = email.trim().toLowerCase();

        if(!editedEmail){

            return res.status(400).json({
                message: "Email is required"
            })
        }

        if(!password){

            return res.status(400).json({

                message: "Password is required"
            })
        }

        if(!validator.isEmail(editedEmail)){

            return res.status(400).json({

                message: "Email must be in valid Format"
            })
        }

       
         const user = await User.findOne({email: editedEmail}).select("+password");

         if(!user){

             return res.status(400).json({

                message: "Invalid email or password"
             })
         }




         const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
         )


         if(!isPasswordCorrect){

            return res.status(401).json({

                message: "Invalid email or password"
            })
         }


         const token = jwt.sign(

            {userId: user._id.toString()},
            process.env.JWT_SECRET,
            {expiresIn: "1d"}
         )


         res.cookie("token", token, {

            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000,
            path: "/"
         })

         return res.status(200).json({

            message: "User Logged in Successfully",
            user: {

                id: user._id,
                name: user.name,
                email: user.email
            }
         })


     }

     catch(error){

        console.log("Error in login controller", error);
        return res.status(500).json({message: "Internal Server Error"})

     }
}





export const logout = async (req,res) => {

     try{

        res.clearCookie("token", {

            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/"
        })

        return res.status(200).json({

            message: "Logged out Successfully"
        })

     }

     catch(error){

        console.log("Error in Logout controller", error);
        return res.status(500).json({

            message: "Internal Server Error"
        })

     }
}


export const getMe = async(req,res) => {

     const user = await User.findById(req.userId).select("name email");

     if(!user){

        return res.status(401).json({

            message: "user not found"
        })
     }

     return res.status(200).json({

        user: {
            id: user.id,
            name: user.name,
            email: user.email,
        }
     })
}



