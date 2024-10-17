require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const PORT = process.env.PORT || 3000;

// Enable preflight across the board
app.options('*', cors());

// CORS middleware
app.use(cors({
  origin: (origin, callback) => {
    callback(null, true); // Allow all origins
  },
  methods: ['GET', 'POST', 'OPTIONS'], // Allow specific methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers
  credentials: true, // Allow credentials if needed
}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

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
