const mongoose = require("mongoose");
const Helper = require("../helper");

const Util = require("../help/index");
const {
  addColIntoProject,
  cutColumnFromProject
} = require("../model/Project.model");

const {
  createNewColForProject,
  removeColumnFrProject,
} = require("../model/Column.model");

class ColController {
  async addColumn(req, res, next) {
    try {
      const { userId, nameCol, projectId } = req.body;
      console.log(userId, nameCol, projectId);
      console.log("userId, nameCol, projectId");
      if (!userId || !nameCol || !projectId) {
        return res.json({ status: false, message: "Invalid data" });
      }

      const projectIdOj = new mongoose.Types.ObjectId(projectId);
      const userIdOj = new mongoose.Types.ObjectId(userId);
      let result = await createNewColForProject({
        name: nameCol,
        project: projectIdOj,
        createdBy: userIdOj,
      });
      const newCol = result;

      if (result) {
        result = await addColIntoProject(result._id, projectId);
        if (result)
          res.json({
            status: true,
            message: "Col created successfully!",
            data: JSON.stringify(newCol),
          });
        else {
          res.json({ status: false, message: "Col created failed!" });
        }
      } else {
        res.json({ status: false, message: "Col created failed!" });
      }
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  async removeColumn(req, res, next) {
    try {
      let { colId, projectId } = req.query;
      if (!colId || !projectId) {
        return res.json({ status: false, message: "Invalid data" });
      }
      projectId = new mongoose.Types.ObjectId(projectId);
      let result = await cutColumnFromProject(colId, projectId);
      console.log("hello");
      if (result) {
        result = await removeColumnFrProject(colId);
        if (result) {
          res.json({
            status: true,
            message: "Column removed successfully!",
          });
        } else {
          res.json({ status: false, message: "Column removal failed!" });
        }
      } else {
        res.json({ status: false, message: "Column removal failed!" });
      }
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
}

module.exports = new ColController();
