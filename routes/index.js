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

router.post("/signin", logInValidation, loginUser);
router.post("/signup", userInfoValidation, createUser);
router.use("/users", userRouter);
router.use("/items", itemRouter);
router.use("/likes", likesRouter);
router.use(() => {
  throw new NotFoundError(`The page you're looking for not found`);
});

module.exports = router;
