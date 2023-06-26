const user = require("./user");
const project = require("./project");

const applyRoute = (app) => {
  app.use("/user", user);
  app.use("/project", project);
};

module.exports = applyRoute;
