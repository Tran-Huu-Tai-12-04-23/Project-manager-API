const mongoose = require("mongoose");

const { Task } = require("./Task.model");

const columnSchema = new mongoose.Schema({
  name: { type: String, required: true },
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
  createBy: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

const Column = mongoose.model("Column", columnSchema);

const createNewColForProject = async (data) => {
  try {
    const newColumn = new Column(data);
    const savedHistory = await newColumn.save();
    return savedHistory;
  } catch (error) {
    console.error("Error creating column:", error);
    throw error;
  }
};

const removeColumnFrProject = async (colId) => {
  try {
    const removedColumn = await Column.findByIdAndRemove(colId);
    const tasks = removedColumn.tasks;

    const removeTaskPromise = Task.deleteMany({ _id: { $in: tasks } });

    const removedTask = await removeTaskPromise;

    return { removedColumn, removedTask };
  } catch (error) {
    console.error("Error removing column and tasks:", error);
    throw error;
  }
};

const removeTaskFrCol = async (colId, taskId) => {
  try {
    const colOfProject = await Column.findOne({ _id: colId });
    if (!colOfProject) {
      return null; // Column not found, return null or handle the case appropriately
    }
    const tasks = colOfProject.tasks;
    const taskIndex = tasks.findIndex(
      (task) =>
        task._id.toString() === new mongoose.Types.ObjectId(taskId).toString()
    );
    if (taskIndex === -1) {
      return null; // Task not found, return null or handle the case appropriately
    }
    const newColTasks = [
      ...tasks.slice(0, taskIndex),
      ...tasks.slice(taskIndex + 1),
    ];
    await Column.updateOne({ _id: colId }, { tasks: newColTasks });
    return taskId; // Return the removed taskId if needed
  } catch (error) {
    console.error("Error removing task from column:", error);
    throw error;
  }
};

const addTaskIntoCol = async (colId, taskId) => {
  try {
    const colOfProject = await Column.findOne({ _id: colId });
    if (colOfProject) {
      const colTask = colOfProject.tasks;
      colTask.push(taskId);
      await Column.updateOne({ _id: colId }, { tasks: colTask });
      return colOfProject;
    }
  } catch (error) {
    console.error("Error querying project:", error);
    throw error;
  }
};

module.exports = {
  Column,
  createNewColForProject,
  removeColumnFrProject,
  removeTaskFrCol,
  addTaskIntoCol,
};
