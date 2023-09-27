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

/*app.use(
  cors({
    origin: "http://localhost:3000",
  })
);*/

app.use(cors());
app.use(helmet());

//requestLogger middleware before your routes
app.use(requestLogger);
app.post("/signin", logInValidation, loginUser);
app.post("/signup", userInfoValidation, createUser);
app.use(routes);

app.use(errorLogger);
app.use(errors());

app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`App started on port: ${PORT}`);
});
