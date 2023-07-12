const mongoose = require("mongoose");
const Helper = require("../helper");
const Util = require("../help/index");

const {
  createNewNote,
  deleteOneNote,
  findNotesByUserAndProject
} = require("../model/Note.model");

class NoteController {

  async createNewNote(req, res, next) {
    try {
      const {projectId, createdBy, content} = req.body;
      if( !projectId || !createdBy || !content ) {
        return res.json({
          status: false,
          message: "Invalid data!!",
        })
      }

      const result = await createNewNote({
        project: new mongoose.Types.ObjectId(projectId), createdBy: new mongoose.Types.ObjectId(createdBy), content
      });

      if( result ) {
        res.json({
          status: true,
          message: "Thêm thành viên thành công!",
          data: JSON.stringify(result),
        })
      }else {
        res.json({
          status: false,
          message: "Thêm thành viên thất bại!",
        })
      }
    } catch (error) {
        console.error(error);
        res.status(500).json({
          message: 'Server is error creating',
      })
    }  
  }

  async getAllNotesByProject(req, res, next) {
    try {
      const { projectId} = req.query;
      if( !projectId ){
        return res.json({
          status: false,
          message: "Invalid data!!",
        })
      }
      const result = await findNotesByUserAndProject( projectId);
      if( result ) {
        res.json({
          status: true,
          message: "Get notes by user and project",
          data: JSON.stringify(result),
        })
      }
      else {
        res.json({
          status: false,
          message: "Get notes by user and project falied!!",
        })
      }
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  async removeNote(req, res, next) {
    try {
      const { noteId } = req.query;
      if( !noteId ){
        return res.json({
          status: false,
          message: "Invalid data!!",
        })
      }
      const result = await deleteOneNote( noteId);
      if( result ) {
        res.json({
          status: true,
          message: "Delete note successfully!",
        })
      }
      else {
        res.json({
          status: false,
          message: "Delete note failed!",
        })
      }
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

}

module.exports = new NoteController();
