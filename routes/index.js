const router = require("express").Router();
const userRouter = require("./users");
const itemRouter = require("./clothingItems");
const likesRouter = require("./clothingItems");

router.use("/", userRouter);
router.use("/", itemRouter);
router.use("/", likesRouter);

module.exports = router;
