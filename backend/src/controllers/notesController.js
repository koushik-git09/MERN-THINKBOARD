import Note from "../models/Note.js";

export async function getAllNotes (req,res) {
    try{
    const notes=await Note.find({ owner: req.user.id }).sort({createdAt:-1});
        res.status(200).json(notes);
    }
    catch(error){
        console.error("Error in getAllNotes Controller",error);
        res.status(500).json({message:"Internal server error"});
    }
}

export async function getNoteById(req, res) {
  try {
    const note = await Note.findOne({ _id: req.params.id, owner: req.user.id });

    // If note is not found
    if (!note) {
      return res.status(404).json({ message: "Note not found!" });
    }

    // If note is found, return it
    res.status(200).json(note);
  } catch (error) {
    console.error("Error in getNoteById controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function createNote(req,res){
    try {
        const {title,content}=req.body
    const note=new Note({title,content, owner: req.user.id })

        const savedNote = await note.save();
        res.status(201).json(savedNote);
    } catch (error) {
         console.error("Error in createNote Controller",error);
        res.status(500).json({message:"Internal server error"});
    }
}

export async function updateNote(req,res){
   try {
     const {title,content}=req.body
    const updatedNote=await Note.findOneAndUpdate({ _id: req.params.id, owner: req.user.id },{title,content},{
        new:true,
     });

     if (!updatedNote) return res.status(404).json({message:"Note not found"});

     res.status(200).json(updatedNote);
   } catch (error) {
    console.error("Error in updateNote Controller",error);
        res.status(500).json({message:"Internal server error"});
   }
}

export async function deleteNote(req,res){
    try {
    const deletedNote=await Note.findOneAndDelete({ _id: req.params.id, owner: req.user.id })
        if(!deletedNote) return res.status(404).json({message:"Note not found"});
        res.status(200).json({message:"Note deleted successfully!"})
    } catch (error) {
         console.error("Error in deleteNote Controller",error);
        res.status(500).json({message:"Internal server error"});
    }
}
