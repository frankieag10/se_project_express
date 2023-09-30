const router = require("express").Router();
const NotFoundError = require("../errors/not-found-error");
const userRouter = require("./users");
const itemRouter = require("./clothingItems");
const likesRouter = require("./clothingItems");

// Add a console log for route entry
router.use((req, res, next) => {
  console.log(`Entering route: ${req.url}`);
  next();
});

router.use("/", userRouter);
router.use("/", itemRouter);
router.use("/", likesRouter);

router.use(() => {
  throw new NotFoundError(`The page you're looking for not found`);
});

module.exports = router;
