const mongoose = require("mongoose");
const Helper = require("../helper");

const Util = require("../help/index");
const {
  getTaskWithHighestOrder,
  createNewTask,
} = require("../model/Task.model");

const {
  createNewNote,
  deleteOneNote,
  findNotesByUserAndProject
} = require("../model/Note.model");

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
  updateProject,
  getNumberProjectDelete,
  restoreProject
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
          { createdBy: user_id, is_delete: false },
        ],
      };
      const result = await getProjectsInfo(condition);

      res.json({ status: true, data: JSON.stringify(result) });
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  async getProjectsDelete(req, res, next) {
    try {
      const { userId } = req.query;
      if (!userId) {
        return res.json({ status: false, message: "Invalid data" });
      }
      const condition = {
        $and: [
          { createdBy: userId, is_delete: true },
        ],
      };
      const result = await getProjectsInfo(condition);

      res.json({ status: true, data: JSON.stringify(result) });
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

  async eidtProject(req, res, next) {
    try {
      const { projectId, name , description, dateEnd, createBy } = req.body;

      if (!projectId || !name || !description ) {
        return res.json({ status: false, message: "Invalid data!!" });
      }
      const files = req.files;

      const fileLinks = req.files.map((file) => `/uploads/${file.filename}`);
      console.log(createBy)
      const newListFIleId = await Promise.all(
        files.map(async (file, index) => {
          const resultInsertFile = await insertNewFile({
            createdBy: createBy,
            filepath: fileLinks[index],
            filename: file.filename,
          });
          return resultInsertFile._id;
        })
      );

      const result =await updateProject(projectId,newListFIleId, {
        name: name, description:description, date_end: dateEnd
      } )


      if (result) {
        res.json({
          status: true,
          message: "Chinh sua dự án thành công!",
          data: JSON.stringify(result),
        });
      } else {
        res.json({
          status: false,
          message: "Chinh sua dự án that bai!",
        });
      }

      return;
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  async getNumberProjectDelete(req, res, next) {
    try {
      const {userId} = req.query;
      if (!userId) {
        return res.json({ status: false, message: "Invalid data" });
      }
      const result = await getNumberProjectDelete({createdBy : userId , is_delete: true });

      if (result|| result === 0) {
        res.json({
          status: true,
          message: "get number project deleted",
          data: result
        });
      } else {
        res.json({
          status: false,
          message: "get number project deleted falied!!",

        });
      }

      return;
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  async restoreProject(req, res, next) {
    try {
      const { projectId } = req.body;

      if (!projectId) {
        return res.json({ status: false, message: "Invalid data" });
      }

      const result = await restoreProject(projectId);

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

module.exports = new ProjectController();
