require("dotenv").config();
const express = require("express");
const cors = require("cors");
const routes = require("./api");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", routes);

const PORT = process.env.PORT || 8080;
app.listen(8080, "0.0.0.0", () => {
  console.log(`Server running at http://0.0.0.0:${PORT}`);
});
