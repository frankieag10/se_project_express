/*const router = require("express").Router();
const auth = require("../middlewares/auth");

const { getCurrentUser, updateUser } = require("../controllers/users");

router.get("/users/me", auth, getCurrentUser);
router.patch("/users/me", auth, updateUser);

module.exports = router;
*/

const router = require("express").Router();
const auth = require("../middlewares/auth");
const { updateUser } = require("../controllers/users");

// Define the update user route with the appropriate HTTP method and callback function.
router.patch("/users/me", auth, updateUser);

module.exports = router;
