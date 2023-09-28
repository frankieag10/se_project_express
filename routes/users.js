const router = require("express").Router();

const auth = require("../middlewares/auth");
const { getCurrentUser, updateUser } = require("../controllers/users");
const { clothingItemValidation } = require("../middlewares/validation");

console.log("GET /users/me", { auth, getCurrentUser });
router.get("/users/me", auth, getCurrentUser);

console.log("PATCH /users/me", { auth, clothingItemValidation, updateUser });
router.patch("/users/me", auth, clothingItemValidation, updateUser);

module.exports = router;
