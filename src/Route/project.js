const express = require("express");
const router = express.Router();
const ProjectController = require("../controller/ProjectController");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const fileExtension = file.originalname.split(".").pop();
    cb(null, `${file.fieldname}-${uniqueSuffix}.${fileExtension}`);
  },
});
const upload = multer({ storage: storage });

router.post("/create-new-task", ProjectController.createNewTask);
router.post("/create-new-col", ProjectController.addColumn);

router.get("/get-projects", ProjectController.getProjects);
router.get("/get-tasks", ProjectController.getTasks);
router.delete("/remove-col", ProjectController.removeColumn);
router.post("/change-col-for-task", ProjectController.changeColForTask);
router.put("/add-member-to-project", ProjectController.addMemberToProject);
router.delete("/remove-soft-project", ProjectController.removeSoftProject);

router.post(
  "/create-new-info-project",
  upload.array("file"),
  ProjectController.createNewInfoProject
);

module.exports = router;
