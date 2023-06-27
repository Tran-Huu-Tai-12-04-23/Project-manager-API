const mongoose = require("mongoose");
const { Column, removeColumnFrProject } = require("./Column.model");

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  columns: [{ type: mongoose.Schema.Types.ObjectId, ref: "Column" }],
  files: [{ type: mongoose.Schema.Types.ObjectId, ref: "File" }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  date_end: { type: Date, default: Date.now },
  member: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
  createdAt: { type: Date, default: Date.now },
  is_delete: { type: Boolean, default: false },
});

const projectHistorySchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

const fileSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  filepath: { type: String, required: true },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

const Project = mongoose.model("Project", projectSchema);
const File = mongoose.model("File", fileSchema);
const History = mongoose.model("History", projectHistorySchema);
// function for getting
const createNewInfoProject = async (data) => {
  try {
    const newProject = new Project(data);
    const savedProject = await newProject.save();
    return savedProject;
  } catch (error) {
    console.error("Error querying project:", error);
    throw error;
  }
};

const getProject = async (projectId) => {
  try {
    const projects = await Project.findOne({ _id: projectId });
    return projects;
  } catch (error) {
    console.error("Error retrieving projects information:", error);
    throw error;
  }
};
const createHistory = async (data) => {
  try {
    const newHistory = new History(data);
    const savedHistory = await newHistory.save();
    return savedHistory;
  } catch (error) {
    console.error("Error creating history:", error);
    throw error;
  }
};

const insertNewFile = async (data) => {
  try {
    const newFile = new File(data);
    const savedHistory = await newFile.save();
    return savedHistory;
  } catch (error) {
    console.error("Error creating history:", error);
    throw error;
  }
};

const getProjectsInfo = async (condition) => {
  try {
    const projects = await Project.find({ ...condition })
      .populate({
        path: "columns",
        populate: {
          path: "tasks",
          model: "Task",
        },
      })
      .populate({
        path: "createdBy",
        model: "user",
      })
      .populate("member");
    return projects;
  } catch (error) {
    console.error("Error retrieving projects information:", error);
    throw error;
  }
};

const addColIntoProject = async (colId, projectId) => {
  try {
    const newProject = await Project.findOne({ _id: projectId });
    if (newProject) {
      const col = newProject.columns;
      col.push(colId);
      console.log(col);
      await Project.updateOne({ _id: projectId }, { columns: col });
      return newProject;
    }
  } catch (error) {
    console.error("Error querying project:", error);
    throw error;
  }
};

const cutColumnFromProject = async (colId, projectId) => {
  try {
    const newProject = await Project.findOne({ _id: projectId });
    if (newProject) {
      const col = newProject.columns;
      col.filter((col) => col._id !== colId);
      await Project.updateOne({ _id: projectId }, { columns: col });
      return newProject;
    }
  } catch (error) {
    console.error("Error querying project:", error);
    throw error;
  }
};

const addMember = async (userId, projectId) => {
  try {
    const newProject = await Project.findOne({ _id: projectId });
    if (newProject) {
      const members = newProject.member;
      members.push(userId);
      console.log(members);
      await Project.updateOne({ _id: projectId }, { member: members });
      return newProject;
    }
  } catch (error) {
    console.error("Error querying project:", error);
    throw error;
  }
};
const removeSoftProject = async (projectId) => {
  try {
    const newProject = await Project.findOne({ _id: projectId });
    if (newProject) {
      await Project.updateOne({ _id: projectId }, { is_delete: true });
      return newProject;
    }
    return false;
  } catch (error) {
    console.error("Error querying project:", error);
    throw error;
  }
};
const forceProject = async (projectId) => {
  try {
    const newProject = await Project.findOne({ _id: projectId });
    if (newProject) {
      let columns = newProject.columns;
      const result = await removeColumnFrProject(colId);
      return result;
    }
    return false;
  } catch (error) {
    console.error("Error querying project:", error);
    throw error;
  }
};

module.exports = {
  Project,
  getProjectsInfo,
  createNewInfoProject,
  createHistory,
  insertNewFile,
  addColIntoProject,
  cutColumnFromProject,
  getProject,
  addMember,
  removeSoftProject,
};
