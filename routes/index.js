const router = require("express").Router();
const NotFoundError = require("../errors/not-found-error");
const userRouter = require("./users");
const itemRouter = require("./clothingItems");
const likesRouter = require("./clothingItems");
const { loginUser, createUser } = require("../controllers/users");
const {
  logInValidation,
  userInfoValidation,
} = require("../middlewares/validation");

// Add a console log for route entry
router.use((req, res, next) => {
  console.log(`Entering route: ${req.url}`);
  next();
});

//router.post("/signin", logInValidation, loginUser);
//router.post("/signup", userInfoValidation, createUser);
router.use("/", userRouter);
router.use("/", itemRouter);
router.use("/", likesRouter);

router.use(() => {
  throw new NotFoundError(`The page you're looking for not found`);
});

module.exports = router;
