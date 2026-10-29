
import jwt from "jsonwebtoken";

export const protectedRoute = (req,res,next) => {

      try{

         const token = req.cookies?.token;

         if(!token){

            return res.status(401).json({

                message: "Authentication required. Please log in"
            })
         }

         const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
         )

         req.userId = decoded.userId;

         next();
      }

     catch(error){

         return res.status(401).json({

             message: "Invalid or expired token, Please log in again"
         })
     }
}