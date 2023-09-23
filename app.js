const express = require("express");
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

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const { PORT = 3001 } = process.env;
const app = express();

app.use(express.json());
app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

/*app.use(
  cors({
    origin: "http://localhost:3000",
  })
);*/

app.use(cors());

//requestLogger middleware before your routes
app.use(requestLogger);

// Define your routes
app.post("/signin", logInValidation, loginUser);
app.post("/signup", userInfoValidation, createUser);

//errorLogger middleware after your routes
app.use(errorLogger);

// routes middleware once to include all your routes
app.use(routes);

//errorHandler middleware to handle errors
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App started on port: ${PORT}`);
});
