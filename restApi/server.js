const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const seekerRoute = require("./routes/seekerRoutes");
const providerRoute = require("./routes/providerRoutes");

const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use("/seeker", seekerRoute);
app.use("/provider", providerRoute);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
