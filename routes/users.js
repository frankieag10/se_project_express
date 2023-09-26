const router = require("express").Router();

const auth = require("../middlewares/auth");
const { getCurrentUser, updateUser } = require("../controllers/users");
const { clothingItemValidation } = require("../middlewares/validation");

router.use(auth);

//user route with the appropriate HTTP method and callback function.
router.get("users/me", getCurrentUser);
console.log({ auth, clothingItemValidation, updateUser });
router.patch("users/me", clothingItemValidation, updateUser);

module.exports = router;
