const router = require("express").Router();
const NotFoundError = require("../errors/not-found-error");
const userRouter = require("./users");
const itemRouter = require("./clothingItems");
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

router.post("/signin", logInValidation, loginUser);
router.post("/signup", userInfoValidation, createUser);
router.use("/items", itemRouter);
router.use("/users", userRouter);

// Add a console log for route entry
router.use(
  "/items",
  (req, res, next) => {
    console.log("Entering /items route");
    next();
  },
  itemRouter
);

// Add a console log for route entry
router.use(
  "/users",
  (req, res, next) => {
    console.log("Entering /users route");
    next();
  },
  userRouter
);

router.use(() => {
  throw new NotFoundError(`The page you're looking for not found`);
});

module.exports = router;
