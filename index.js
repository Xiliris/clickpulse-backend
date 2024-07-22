require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 3000;

const RouteHandler = require("@xiliris/express-route-handler");
const path = require("path");
const routePath = path.join(__dirname, "routes");
const routeData = {
  log: true,
};
const loadMongoDatabase = require("./database/loadMongo");

// Apply middlewares before handling routes
app.use(bodyParser.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

const routeHandler = new RouteHandler(app, routePath, routeData);

// Load routes after middlewares
routeHandler.handleRoutes();

// Load MongoDB
loadMongoDatabase();

// Start the server
app.listen(PORT, () => {
  console.log(`> Started on port: ${PORT}`);
  setTimeout(() => {
    console.log(`> http://localhost:${PORT}`);
  }, 1000);
});
