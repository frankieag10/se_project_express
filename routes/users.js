const router = require("express").Router();

const auth = require("../middlewares/auth");
const { getCurrentUser, updateUser } = require("../controllers/users");
const { clothingItemValidation } = require("../middlewares/validation");

console.log("GET /me", { auth, getCurrentUser });
router.get("/me", auth, getCurrentUser);

console.log("PATCH /me", { auth, clothingItemValidation, updateUser });
router.patch("/me", auth, clothingItemValidation, updateUser);

module.exports = router;
