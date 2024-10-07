require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 3000;
const path = require("path");

app.use(cors());

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());

const RouteHandler = require("@xiliris/express-route-handler");
const routePath = path.join(__dirname, "routes");
const routeData = {
  log: true,
};

const database = require("./database/mysql");

const routeHandler = new RouteHandler(app, routePath, routeData);

routeHandler.handleRoutes();

app.listen(PORT, async () => {
  console.log(`> Started on port: ${PORT}`);

  try {
    await database.query("SELECT 1");
    console.log("> Connected to SQL Database.");
  } catch (error) {
    console.error("Error during database connection:", error.message);
    process.exit(1);
  }

  setTimeout(() => {
    console.log(`> http://localhost:${PORT}`);
  }, 1000);
});
