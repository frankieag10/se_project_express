const express = require("express");
const mongoose = require("mongoose");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const { ERROR_404 } = require("./utils/errors");
const routes = require("./routes");

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");
const { PORT = 3001 } = process.env;
const app = express();
app.use(express.json());
app.use((req, res, next) => {
  req.user = {
    _id: "5d8b8592978f8bd833ca8133", // paste the _id of the test user created in the previous step
  };
  next();
});

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
