const user = require("./user");

const applyRoute = (app) => {
  app.use("/user", user);
};

module.exports = applyRoute;
