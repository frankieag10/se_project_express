const router = require("express").Router();

const clothingItem = require("./clothingItems");
const User = require("./users");
const itemRouter = require("./clothingItems");
const likesRouter = require("./clothingItems");

const { ERROR_404 } = require("../utils/errors");
const { createUser, loginUser } = require("../controllers/users");

router.use("/", clothingItem);
router.use("/", User);
router.use("/", itemRouter);
router.use("/", likesRouter);

router.post("/signup", createUser);
router.post("/signin", loginUser);

router.use((req, res) => {
  res
    .status(ERROR_404)
    .send({ message: "The requested resource was not found" });
});

module.exports = router;
