require("dotenv").config();
const express = require("express");
const cors = require("cors");
const routes = require("./api");
const path = require("path");
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", routes);

const PORT = process.env.PORT || 8080;

const dataDir = path.resolve(__dirname, "../data");
app.use("/data", express.static(dataDir));

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running at http://0.0.0.0:${PORT}`);
});
