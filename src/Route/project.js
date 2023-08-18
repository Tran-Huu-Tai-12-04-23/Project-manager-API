const express = require('express');
const router = express.Router();
const ProjectController = require('../controller/ProjectController');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: 'src/uploads',
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const fileExtension = file.originalname.split('.').pop();
        cb(null, `${file.fieldname}-${uniqueSuffix}.${fileExtension}`);
    },
});
const upload = multer({ storage: storage });

router.get('/get-projects', ProjectController.getProjects);
router.put('/add-member-to-project', ProjectController.addMemberToProject);
router.delete('/remove-soft-project', ProjectController.removeSoftProject);
router.delete('/remove-project', ProjectController.removeProject);
router.put('/edit-project', upload.array('file'), ProjectController.editProject);
router.get('/get-projects-delete', ProjectController.getProjectsDelete);
router.get('/count-number-project-trash', ProjectController.getNumberProjectDelete);
router.put('/restore-project', ProjectController.restoreProject);
router.post('/create-new-info-project', upload.array('file'), ProjectController.createNewInfoProject);

module.exports = router;
