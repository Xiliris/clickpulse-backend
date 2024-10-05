require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 3000;
const sendVerifyEmail = require("./modules/sendVerifyEmail");

const RouteHandler = require("@xiliris/express-route-handler");
const path = require("path");
const routePath = path.join(__dirname, "routes");
const routeData = {
  log: true,
};

const database = require("./database/mysql");

app.use(bodyParser.json());
app.use(
  cors({
    origin: "*",
  })
);

const routeHandler = new RouteHandler(app, routePath, routeData);

routeHandler.handleRoutes();

app.listen(PORT, async () => {
  console.log(`> Started on port: ${PORT}`);
  // sendVerifyEmail("adnanskopljak420@gmail.com", "42069");

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
