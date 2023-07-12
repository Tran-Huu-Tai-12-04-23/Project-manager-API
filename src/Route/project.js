const express = require("express");
const router = express.Router();
const ProjectController = require("../controller/ProjectController");
const multer = require("multer");

const storage = multer.diskStorage({
  destination:'src/uploads',
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const fileExtension = file.originalname.split(".").pop();
    cb(null, `${file.fieldname}-${uniqueSuffix}.${fileExtension}`);
  },
});
const upload = multer({ storage: storage });

router.post("/create-new-col", ProjectController.addColumn);
router.get("/get-projects", ProjectController.getProjects);
router.delete("/remove-col", ProjectController.removeColumn);
router.put("/add-member-to-project", ProjectController.addMemberToProject);
router.delete("/remove-soft-project", ProjectController.removeSoftProject);
router.put("/edit-project",   upload.array("file"),ProjectController.eidtProject);
router.get("/get-projects-delete",ProjectController.getProjectsDelete);
router.get("/count-number-project-trash",ProjectController.getNumberProjectDelete);
router.put("/restore-project",ProjectController.restoreProject);
router.post("/create-new-note",ProjectController.createNewNote);
router.get("/get-all-notes",ProjectController.getAllNotesByProject);
router.delete("/remove-note",ProjectController.removeNote);
router.post(
  "/create-new-info-project",
  upload.array("file"),
  ProjectController.createNewInfoProject
);

module.exports = router;
