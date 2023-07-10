const mongoose = require("mongoose");

const noteSechma = new mongoose.Schema({
    content: {type: String, require: true},
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    createdAt: { type: Date, default: Date.now},
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
});

const Note = mongoose.model("Note", noteSechma);

const createNewNote = async (data) => {
  try {
    const newNote = new Note(data);
    const savedHistory = await newNote.save();
    const noteId = savedHistory._id;
    const result = await Note.findById(noteId).populate({
      path: "createdBy",
      model: "user",
    });
    return result;
  } catch (error) {
    console.error("Error creating column:", error);
    throw error;
  }
}
const findNotesByUserAndProject = async (projectId) => {
  try {
    const notes = await Note.find({
      project: new mongoose.Types.ObjectId(projectId)
    }).populate({
      path: "createdBy",
      model: "user",
    });
    return notes;
  } catch (error) {
    console.error("Error finding notes:", error);
    throw error;
  }
  
};

const deleteOneNote = async (noteId) => {
  try {
    const result = await Note.findByIdAndDelete(noteId)
    return result;
  } catch (error) {
    console.error("Error finding notes:", error);
    throw error;
  }
}



module.exports = {
  Note,
  createNewNote,
  findNotesByUserAndProject,
  deleteOneNote
};
