const express = require("express");
const mongoose = require("mongoose");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const jwt = require("jsonwebtoken");
const User = require("./models/users");
const { ERROR_404, JWT_SECRET } = require("./utils/config");
const routes = require("./routes");

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");

const { PORT = 3001 } = process.env;
const app = express();
app.use(express.json());

app.use(async (req, res, next) => {
  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      const token = req.headers.authorization.split(" ")[1];
      const userData = jwt.verify(token, JWT_SECRET);
      const user = await User.findById(userData._id);
      if (!user) throw new Error();
      req.user = user;
    }
  } catch (err) {
    req.user = null;
  }
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
