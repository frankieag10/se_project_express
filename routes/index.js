const router = require("express").Router();
const NotFoundError = require("../errors/not-found-error");
const userRouter = require("./users");
const itemRouter = require("./clothingItems");
const likesRouter = require("./clothingItems");

router.use("/", userRouter);
router.use("/", itemRouter);
router.use("/", likesRouter);
router.use(() => {
  throw new NotFoundError(`The page you're looking for not found`);
});

module.exports = router;

/*const {
  logInValidation,
  userInfoValidation,
} = require("../middlewares/validation");
const { createUser, loginUser } = require("../controllers/users");

// Import route modules
const itemRouter = require("./clothingItems");
const userRouter = require("./users");

// Define routes
router.use("/items", itemRouter);
router.use("/users", userRouter);

router.post("/signup", userInfoValidation, createUser);
router.post("/signin", logInValidation, loginUser);

// Handle 404 errors
router.use((req, res, next) => {
  next(new NotFoundError(`The page you're looking for was not found`));
});

module.exports = router;
*/
