const user = require("./user");
const project = require("./project");
const task = require("./task");

const applyRoute = (app) => {
  app.use("/user", user);
  app.use("/project", project);
  app.use("/task", task);
};

module.exports = applyRoute;
