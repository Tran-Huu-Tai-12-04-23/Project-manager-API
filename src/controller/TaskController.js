const mongoose = require("mongoose");
const Helper = require("../helper");

const Util = require("../help/index");
const {
  getTaskWithHighestOrder,
  createNewTask,
  updateTask,
  removeTask
} = require("../model/Task.model");

const {
  removeTaskFrCol,
  addTaskIntoCol,
} = require("../model/Column.model");


class TaskController {
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

  async updateDate(req, res, next) {
    try {
      const {taskId, newDate} = req.body;

      if( !taskId || !newDate) {
        return res.json({ status: false, message: "Invalid data!" });
      }

      const result = await updateTask(taskId, {
        createdAt: newDate,
      });

      if(result ) {
        res.json({
          status: true,
          message: "Cập nhật thành công!",
          data: JSON.stringify(result),
        });
      }else {
        res.json({
          status: false,
          message: "Cập nhật thất bại!",
        });
      }
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  async update(req, res , next) {
    try {
      const {taskId, name, description, date, priority} = req.body;
      if(!taskId ||!name ||!date ) {
        return res.json({ status: false, message: "Invalid data!" });
      }

      const result = await updateTask(taskId, {
        name, description, createdAt: date, priority
      });

      if(result ) {
        res.json({status: true, message: "Cap nhat thanh cong!", data: JSON.stringify(result)});
      }else {
        res.json({
          status: false,
          message: "Cập nhật thất bại!",
        });
      }
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  async remove(req, res, next) {
    try {
      const { taskId } = req.query;
      if(!taskId ) {
        return res.json({ status: false, message: "Invalid data!" });
      }
    
      const result = await removeTask(taskId);

      if(result ) {
        res.json({status: true, message: "Xóa thành công!", data: JSON.stringify(result)});
      }else {
        res.json({
          status: false,
          message: "Xóa thất bại!",
        });
      }
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
}

module.exports = new TaskController();
