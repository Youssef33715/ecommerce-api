const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const helmet = require("helmet"); //

//dotenv.config({ path: "config.env" });
if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: path.join(__dirname, "config.env") });
}
//dotenv.config({ path: path.join(__dirname, "config.env") });
//dotenv.config();
//const { config } = require("process");
const ApiError = require("./utils/apiError");
const globalError = require("./middleware/errorMiddleware");
const dbConnection = require("./config/database");
//Routes
const mountRoutes = require("./routes/index");
const { webhookCheckout } = require("./services/orderService");
//connect with db;
dbConnection();

//express app
const app = express();
app.use(helmet());

app.use(cors()); // To enable the other domain to access your application
// Compress all responses
app.use(compression());

//Checkout webhook
app.post(
  "/webhook-checkout",
  express.raw({ type: "application/json" }),
  webhookCheckout,
);
//Middlewares
app.use(express.json({ limit: "20kb" }));
app.use(express.static(path.join(__dirname, "uploads")));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`Mode: ${process.env.NODE_ENV}`);
}
//To apply data sanitization =>Secuirty
//app.use(mongoSanitize());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  message: "Too many account from this IP, please try again later.",
});

// Apply the rate limiting middleware to all requests.
app.use("/api", limiter);
app.use(
  hpp({
    whitelist: [
      "price",
      "sold",
      "quantity",
      "ratingsAverage",
      "ratingsQuantity",
    ],
  }),
); // <- middleware to protect against HTTP Parameter Pollution attacks

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
