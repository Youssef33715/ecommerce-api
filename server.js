const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const compression = require("compression");

//dotenv.config({ path: "config.env" });
dotenv.config({ path: path.join(__dirname, "config.env") });
//dotenv.config();
//const { config } = require("process");
const ApiError = require("./utils/apiError");
const globalError = require("./middleware/errorMiddleware");
const dbConnection = require("./config/database");
//Routes
const mountRoutes = require("./routes/index");
//connect with db;
dbConnection();

//express app
const app = express();
app.use(cors()); // To enable the other domain to access your application
// Compress all responses
app.use(compression());

//Middlewares
app.use(express.json());
app.use(express.static(path.join(__dirname, "uploads")));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`Mode: ${process.env.NODE_ENV}`);
}
//Mount Routes
mountRoutes(app);
/////////////
app.use((req, res, next) => {
  //const err =new Error(`Cannot find this route: ${req.originalUrl}`);
  next(new ApiError(`Cannot find this route: ${req.originalUrl}`, 400));
});

// Global error handling middleware
app.use(globalError);

const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log(`App running On PORT ${PORT}`);
});

// Handle rejection outside express
process.on("unhandledRejection", (err) => {
  console.error(`UnhandledRejection Errors:${err.name} | ${err.message}`);
  server.close(() => {
    console.error(`Shutting down....`);
    process.exit(1);
  });
});
