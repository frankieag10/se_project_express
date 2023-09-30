const router = require("express").Router();

const auth = require("../middlewares/auth");
const { getCurrentUser, updateUser } = require("../controllers/users");
const {
  clothingItemValidation,
  updateUserValidation,
} = require("../middlewares/validation");

console.log("GET /me", { auth, getCurrentUser });
router.get("/users/me", auth, getCurrentUser);

console.log("PATCH /me", { auth, clothingItemValidation, updateUser });
router.patch("/users/me", auth, updateUserValidation, updateUser);

module.exports = router;
