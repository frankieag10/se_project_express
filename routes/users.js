const router = require("express").Router();

const auth = require("../middlewares/auth");
const { getCurrentUser, updateUser } = require("../controllers/users");
const { clothingItemValidation } = require("../middlewares/validation");

//user route with the appropriate HTTP method and callback function.
router.get("/users/me", auth, getCurrentUser);
console.log({ auth, clothingItemValidation, updateUser });
router.patch("/users/me", auth, clothingItemValidation, updateUser);

module.exports = router;
