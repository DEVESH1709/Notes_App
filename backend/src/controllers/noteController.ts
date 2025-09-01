// import {Request, Response} from "express";

// import Note from '../models/Note';

// export const createNote = async (req : Request,res :Response)=>{
//     try{
//         const {content} = req.body;
    
//     const userId = (req as any).userId;  
//     if (!content) return res.status(400).json({ message: 'Content is required' });
//     const note = new Note({ content, userId });
//     await note.save();
//     res.status(201).json(note);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Server error' });
//   }
    
// };


// export const getNotes = async (req : Request , res : Response)=>{
//     try{
//         const userId  = (req as any ).userId;
//         const notes = await Note.find({userId}).sort({createdAt :-1});
//          res.json(notes);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Server error' });
//     }
// }


// export const deleteNote = async (req :Request,res: Response)=>{
//     try{
//          const userId = (req as any).userId;
//     const noteId = req.params.id;
//     const note = await Note.findOneAndDelete({ _id: noteId, userId });
//     if (!note) {
//       return res.status(404).json({ message: 'Note not found' });
//     }
//     res.json({ message: 'Note deleted' });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Server error' });
//     }
// }

import { Request, Response } from "express";
import Note from '../models/Note';

// Use the type we defined in middleware
interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
  };
}

export const createNote = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { content } = req.body;
    const userId = req.user?.userId;   // ✅ fix

    if (!content) {
      return res.status(400).json({ message: 'Content is required' });
    }
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: userId missing' });
    }

    const note = new Note({ content, userId });
    await note.save();
    res.status(201).json(note);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getNotes = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;  // ✅ fix
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: userId missing' });
    }

    const notes = await Note.find({ userId }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteNote = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;  // ✅ fix
    const noteId = req.params.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: userId missing' });
    }

    const note = await Note.findOneAndDelete({ _id: noteId, userId });
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    res.json({ message: 'Note deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
