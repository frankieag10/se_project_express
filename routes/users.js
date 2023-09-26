const router = require("express").Router();

const auth = require("../middlewares/auth");
const { getCurrentUser, updateUser } = require("../controllers/users");
const { clothingItemValidation } = require("../middlewares/validation");

router.use(auth);

//user route with the appropriate HTTP method and callback function.
router.get("/me", getCurrentUser);
console.log({ auth, clothingItemValidation, updateUser });
router.patch("/me", clothingItemValidation, updateUser);

module.exports = router;
