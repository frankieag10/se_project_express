const express = require("express");
const mongoose = require("mongoose");

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
  },
);

const routes = require("./routes");
app.use(express.json());
app.use(routes);

app.get("/", (req, res) => {
  res.send("Hello, Express!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
