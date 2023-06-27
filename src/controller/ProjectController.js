const mongoose = require("mongoose");

const Util = require("../help/index");
const {
  getTaskWithHighestOrder,
  createNewTask,
} = require("../model/Task.model");
const {
  createNewInfoProject,
  createHistory,
  insertNewFile,
  getProjectsInfo,
  addColIntoProject,
  cutColumnFromProject,
  addMember,
  removeSoftProject,
  forceProject,
} = require("../model/Project.model");

const {
  createNewColForProject,
  removeColumnFrProject,
  removeTaskFrCol,
  addTaskIntoCol,
} = require("../model/Column.model");

class ProjectController {
  async createNewInfoProject(req, res, next) {
    try {
      const { user_id_init, title, description, date_end, member } = req.body;

      if (!user_id_init || !title || !description || !date_end) {
        return res.json({ status: false, message: "Invalid data!!" });
      }
      const files = req.files;

      let result;
      const fileLinks = req.files.map((file) => `/uploads/${file.filename}`);
      const listIdFiles = await Promise.all(
        files.map(async (file, index) => {
          const resultInsertFile = await insertNewFile({
            createdBy: user_id_init,
            filepath: fileLinks[index],
            filename: file.filename,
          });
          return resultInsertFile._id;
        })
      );

      const newProject = await createNewInfoProject({
        createdBy: user_id_init,
        name: title,
        description,
        date_end,
        member: member ? member : [],
        files: listIdFiles,
      });
      let idProject = newProject._id;

      result = await createHistory({
        createdBy: user_id_init,
        project: idProject,
      });

      res.json({
        status: true,
        message: "Thêm mới project thành công!",
        data: JSON.stringify(newProject),
      });
      console.log(result);
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  async getProjects(req, res, next) {
    try {
      const { user_id } = req.query;
      if (!user_id) {
        return res.json({ status: false, message: "Invalid data" });
      }
      const condition = {
        $and: [
          { createdBy: new mongoose.Types.ObjectId(user_id), is_delete: false },
        ],
      };
      const result = await getProjectsInfo(condition);

      res.json({ status: true, data: JSON.stringify(result) });
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  async addColumn(req, res, next) {
    try {
      const { userId, nameCol, projectId } = req.body;
      console.log(userId, nameCol, projectId);
      console.log("userId, nameCol, projectId");
      if (!userId || !nameCol || !projectId) {
        return res.json({ status: false, message: "Invalid data" });
      }

      const projectIdOj = new mongoose.Types.ObjectId(projectId);
      const userIdOj = new mongoose.Types.ObjectId(projectId);
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

  async createNewTask(req, res, next) {
    try {
      const { createBy, name, description, date, colId, priority } = req.body;
      // Kiểm tra dữ liệu đầu vào
      if (!name) {
        return res.json({ status: false, message: "Invalid data!" });
      }
      // Lấy công việc có order cao nhất trong cột
      let result = await getTaskWithHighestOrder({ _id: colId });
      // Tạo công việc mới
      let colIdObject = new mongoose.Types.ObjectId(colId);
      const newTask = await createNewTask({
        createBy,
        name,
        description,
        date,
        column: colIdObject,
        priority: +priority,
        order: result,
      });

      let idTask = newTask._id;
      result = await addTaskIntoCol(colId, idTask);
      // Kiểm tra kết quả và trả về phản hồi tương ứng
      if (result) {
        res.json({
          status: true,
          message: "Thêm mới công việc thành công!",
          data: JSON.stringify(newTask),
        });
      } else {
        res.json({
          status: false,
          message: "Thêm mới công việc không thành công!",
        });
      }
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  async getTasks(req, res, next) {
    // try {
    //   const { project_id } = req.query;
    //   if (!project_id) {
    //     return res.json({ status: false, message: "Invalid data!" });
    //   }
    //   const result = await Project.getTasks(project_id);
    //   return res.json({
    //     status: true,
    //     message: "Get tasks!",
    //     data: JSON.stringify(result),
    //   });
    // } catch (error) {
    //   console.error(error);
    //   next(error);
    // }
  }

  async changeColForTask(req, res, next) {
    try {
      const { colIdSource, colIdDes, taskId } = req.body;

      let taskDelete = await removeTaskFrCol(colIdSource, taskId);
      console.log(taskDelete);
      if (taskDelete) {
        const result = await addTaskIntoCol(colIdDes, taskId);
        if (result) {
          res.json({
            status: true,
            message: "Thay đổi công việc thành công!",
            data: JSON.stringify(newTask),
          });
        } else {
          res.json({
            status: false,
            message: "Thay đổi công việc không thành công!",
          });
        }
      } else {
        res.json({
          status: false,
          message: "Thay đổi công việc không thành công!",
        });
      }
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  async addMemberToProject(req, res, next) {
    try {
      const { userId, projectId } = req.body;

      if (!userId || !projectId) {
        return res.json({ status: false, message: "Invalid data" });
      }

      const result = await addMember(userId, projectId);

      if (result) {
        res.json({
          status: true,
          message: "Thêm thành viên thành công!",
          data: JSON.stringify(result),
        });
      } else {
        res.json({
          status: false,
          message: "Thêm thành viên thất bại!",
        });
      }

      return;
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  async removeSoftProject(req, res, next) {
    try {
      const { projectId } = req.query;

      if (!projectId) {
        return res.json({ status: false, message: "Invalid data" });
      }

      const result = await removeSoftProject(projectId);

      if (result) {
        res.json({
          status: true,
          message: "Xóa dự án thành công!",
        });
      } else {
        res.json({
          status: false,
          message: "Xóa dự án thất bại!",
        });
      }

      return;
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  async forceProject(req, res, next) {
    try {
      const { projectId } = req.query;

      if (!projectId) {
        return res.json({ status: false, message: "Invalid data" });
      }

      const result = await forceProject(projectId);

      if (result) {
        res.json({
          status: true,
          message: "Xóa dự án thành công!",
        });
      } else {
        res.json({
          status: false,
          message: "Xóa dự án thất bại!",
        });
      }

      return;
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
}

module.exports = new ProjectController();
