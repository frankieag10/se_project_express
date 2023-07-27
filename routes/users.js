const router = require("express").Router();
const { loginUser } = require("../controllers/users");
const { getCurrentUser } = require("../controllers/users");
const { updateUser } = require("../controllers/users");

// POST /users/login — log in a user
router.post("/login", loginUser);
router.get("/users/me", getCurrentUser);
router.patch("/users/me", updateUser);

module.exports = router;
