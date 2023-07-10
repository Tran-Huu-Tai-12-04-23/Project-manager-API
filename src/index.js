require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const connectDb = require("./configDb");
const path = require('path');

const staticFolderPath = path.join(__dirname); 
app.use(express.static(staticFolderPath));

app.use(express.static('public'));
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
connectDb();
const port = process.env.PORT || 3000;
const applyRoute = require("./Route/index");

applyRoute(app);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
