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

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);
app.use(helmet());
app.use(errorHandler);
app.use(errors());
app.post("/signin", logInValidation, loginUser);
app.post("/signup", userInfoValidation, createUser);
app.use(requestLogger);
app.use(routes);
app.use(errorLogger);

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

app.use(routes);

app.listen(PORT, () => {
  console.log(`App started on port: ${PORT}`);
});
