const express = require("express");
const mongoose = require("mongoose");
const { ERROR_404 } = require("./utils/errors");

const app = express();
const { PORT = 3001 } = process.env;

mongoose.connect(
  "mongodb://127.0.0.1:27017/wtwr_db",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) {
      console.error("Failed to connect to MongoDB:", err);
    } else {
      console.log("Successfully connected to MongoDB");
    }
  }
);

app.use((req, res, next) => {
  req.user = {
    _id: "5d8b8592978f8bd833ca8133", // paste the _id of the test user created in the previous step
  };
  next();
});

const routes = require("./routes");
app.use(express.json());
app.use(routes);
app.all("*", (req, res) => {
  res.status(ERROR_404).send({ message: "The requested resource not found" });
});

app.get("/", (req, res) => {
  res.send("Hello, Express!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
