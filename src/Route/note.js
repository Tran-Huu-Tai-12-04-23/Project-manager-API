const express = require("express");
const router = express.Router();
const NoteController = require("../controller/NoteController");

router.post("/create-new-note",NoteController.createNewNote);
router.get("/get-all-notes",NoteController.getAllNotesByProject);
router.delete("/remove-note",NoteController.removeNote);

module.exports = router;
