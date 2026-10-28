import mongoose from "mongoose";
import Note from "../models/Note.js"


export const getAllNotes = async (req,res) => {

     try{

        const notes = await Note.find();

        return res.status(200).json({
            data: notes
        });
     }

     catch(error){

        console.log("Error in getAllNotes controller", error.message);
        return res.status(500).json({message: "Internal Server Error"});
     }

}

export const getNoteById = async (req,res) => {

     try{

        const { id } = req.params;

         if (!mongoose.isValidObjectId(id)) {
             return res.status(400).json({
             success: false,
            });
         }


         const note = await Note.findById(id);

         if(!note){

            return res.status(400).json({message: "Note cannot be found"})
         }


         return res.status(200).json({
            data: note
         })


     }

     catch(error){

        console.log("Error in getNoteById controller", error);
        return res.status(500).json({message: "Internal sevrer error"})
     }
     
}

export const createNote = async (req,res) => {

     try{

        const {title, content} = req.body;

        if(!title || !title.length || !content || !content.length){

            return res.status(400).json({message: "Note title and content are required"});
        }

        const note = await Note.create({title: title.trim(), content: content.trim()});

        if(!note){

            return res.status(400).json({message: "cannot create note"})
        }

        return res.status(201).json({
            message: "New Note created succesffuly",
            data:note
        })


     }

     catch(error){

        console.log("Error in createNote controller", error.message);
        return res.status(500).json({message: "Internal server error"});
     }
     
}


export const updateNote = async (req,res) => {

     try{

        const { id } = req.params;

        const {title, content} = req.body;

         if (!mongoose.isValidObjectId(id)) {
             return res.status(400).json({
             success: false,
            });
         }

         const note = await Note.findById(id);

         if(!note){

            return res.status(404).json({message: "Note not found"})
         }

           if ((title !== undefined && (typeof title !== "string" ||
                  !title.trim())) ||(content !== undefined &&
        (typeof content !== "string" || !content.trim()))
    ) {
      return res.status(400).json({
        success: false,
        message: "Title and content must be non-empty strings"
      });
       }

       if (title !== undefined) note.title = title.trim();
      if (content !== undefined) note.content = content.trim();

      await note.save();

     return res.status(200).json({
      success: true,
      message: "Note updated successfully",
      data: note
    });


     }

     catch(error){

        console.error("Error in updateNote controller", error.message);
        return res.status(500).json({message: "Internal server error"})
     }
     
}


export const deleteNote = async (req,res) => {

     try{

        const {id} = req.params;


        if (!mongoose.isValidObjectId(id)) {
             return res.status(400).json({
             success: false,
            });
         }

         const note = await Note.findByIdAndDelete(id);

         if(!note){

            return res.status(404).json({

                message: "Note not found"
            })
         }

         return res.status(200).json({
            message: "Note deleted successfully"
         })


     }

     catch(error){

        console.log("Error in deleteNote controller");
        return res.status(500).json({message: "Internal server error"});
     }
     
}