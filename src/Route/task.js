const express = require("express");
const router = express.Router();
const TaskController = require("../controller/TaskController");
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

router.post("/create-new-task", TaskController.createNewTask);
router.get("/get-tasks", TaskController.getTasks);
router.post("/change-col-for-task", TaskController.changeColForTask);
router.put("/update-date", TaskController.updateDate);
router.put("/update", TaskController.update);
router.delete("/remove", TaskController.remove);

module.exports = router;
