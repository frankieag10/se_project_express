/*const router = require("express").Router();
//update
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

router.get("/users", (req, res) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer")) {
    res.status(400).send("Authorization is still required\n");
  } else {
    res.send(User);
  }
});

router.use((req, res) => {
  res
    .status(ERROR_404)
    .send({ message: "The requested resource was not found" });
});

module.exports = router;
*/

const router = require("express").Router();
//const { ERROR_404 } = require("../utils/errors");
//const { createUser, loginUser } = require("../controllers/users");

// Import route modules
const clothingItemRouter = require("./clothingItems");
const userRouter = require("./users");
const likeRouter = require("./clothingItems");
const auth = require("../middlewares/auth");
const NotFoundError = require("../errors/not-found-error");
const {
  loginValidation,
  userInfoValidation,
} = require("../middlewares/validation");
const { createUser, loginUser } = require("./users");

// Define routes
router.use("/items", clothingItemRouter);
router.use("/users", auth, userRouter);
router.use("/likes", likeRouter);

router.post("/signup", userInfoValidation, createUser);
router.post("/signin", loginValidation, loginUser);

router.use(() => {
  throw new NotFoundError(`The page you're looking for not found`);
});

module.exports = router;
