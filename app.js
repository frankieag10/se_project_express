const express = require("express");
const mongoose = require("mongoose");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const auth = require("./middlewares/auth"); // import the auth middleware
const { ERROR_404 } = require("./utils/errors"); // import error from errors.js

const routes = require("./routes");

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

const { PORT = 3001 } = process.env;
const app = express();

app.use(express.json());

// Use the imported auth middleware
app.use(auth);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

app.use(helmet());
app.use(routes);

app.all("*", (req, res) => {
  res.status(ERROR_404).send({ message: "The requested resource not found" });
});

app.listen(PORT, () => {
  console.log(`App started on port: ${PORT}`);
});
