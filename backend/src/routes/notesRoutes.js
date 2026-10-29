
import express from "express";
import { createNote, deleteNote, getAllNotes, getNoteById, updateNote } from "../controller/noteController.js";
import { protectedRoute } from "../middleware/authMiddleware.js";

const router = express.Router();


router.get("/", protectedRoute ,getAllNotes);

router.get("/:id", protectedRoute, getNoteById);

router.post("/", protectedRoute, createNote);

router.put("/:id", protectedRoute, updateNote);

router.delete("/:id", protectedRoute, deleteNote);



export default router;