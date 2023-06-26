const mongoose = require("mongoose");

// Định nghĩa Schema cho Task
const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  user_id_init: String,
  date: Date,
  priority: Number,
  order: Number,
});

// Định nghĩa Schema cho Member
const memberSchema = new mongoose.Schema({
  user_id: String,
});

// Định nghĩa Schema cho Column
const columnSchema = new mongoose.Schema({
  title: String,
  tasks: [taskSchema], // Một mảng chứa các task trong column
});

// Định nghĩa Schema cho Board
const boardSchema = new mongoose.Schema({
  user_id_init: String,
  name: String,
  columns: [columnSchema], // Một mảng chứa các column trong board
  description: String,
  date_end: Date,
  member: [memberSchema], // Một mảng chứa các member trong board
});

// Tạo Model từ Schema
const Board = mongoose.model("Board", boardSchema);

module.exports = Board;
