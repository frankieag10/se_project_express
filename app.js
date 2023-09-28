const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const cors = require("cors");
const routes = require("./routes");
const { errorHandler } = require("./middlewares/error-handler");
const { errors } = require("celebrate");
const { createUser, loginUser } = require("./controllers/users");
const {
  userInfoValidation,
  logInValidation,
} = require("./middlewares/validation");
const { requestLogger, errorLogger } = require("./middlewares/logger");

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");
const { PORT = 3001 } = process.env;
const app = express();
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);
app.use(cors());
app.use(helmet());

// Add console log to indicate the server is starting
console.log("Starting the server...");

//requestLogger middleware before your routes
app.use(requestLogger);
app.post("/signin", logInValidation, loginUser);
app.post("/signup", userInfoValidation, createUser);
app.use(routes);

// Add console log for indicating that routes are set up
console.log("Routes are set up.");

app.use(errorLogger);
app.use(errors());

// Add console log for indicating that error handlers are set up
console.log("Error handlers are set up.");

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App started on port: ${PORT}`);
});
