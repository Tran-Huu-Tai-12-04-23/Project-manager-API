const user = require("./user");
const project = require("./project");
const task = require("./task");
const note = require("./note");
const column = require("./column");
const link = require("./link");

const applyRoute = (app) => {
  app.use("/user", user);
  app.use("/project", project);
  app.use("/task", task);
  app.use("/note", note);
  app.use("/col", column);
  app.use("/link", link);
};

module.exports = applyRoute;
