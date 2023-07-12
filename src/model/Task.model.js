const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  name: { type: String, required: true },
  createBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  description: { type: String },
  order: { type: Number },
  column: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Column",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
  priority: { type: Number, default: 0 },
});
const Task = mongoose.model("Task", taskSchema);

const getTaskWithHighestOrder = async (condition) => {
  try {
    const task = await Task.findOne({ ...condition })
      .sort({ order: -1 })
      .limit(1)
      .exec();

    if (task) {
      return task.order + 1;
    } else {
      return 0; // Trả về -1 nếu không có công việc nào được tìm thấy
    }
  } catch (error) {
    console.error("Error retrieving task:", error);
    throw error;
  }
};

const createNewTask = async (task) => {
  try {
    const newTask = new Task(task);
    const res = await newTask.save();
    return res;
  } catch (error) {
    console.error("Error retrieving task:", error);
    throw error;
  }
};

const updateTask = async (taskId, dataParams) => {
  try {
    const updatedTask = await Task.findOneAndUpdate({ _id: taskId }, dataParams, {
      new: true
    });

    if (updatedTask) {
      return updatedTask;
    }

    return false;
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
};

const removeTask = async (taskId) => {
  try {
    const removeTask = await Task.findByIdAndRemove(taskId);
    if (removeTask) {
      return removeTask;
    }
    return false;
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
}


module.exports = { Task, getTaskWithHighestOrder, createNewTask, updateTask, removeTask};
