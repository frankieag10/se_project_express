const express = require("express");
const router = express.Router();

const {
  getUsers,
  getUser,
  createUser,
  loginUser,
} = require("../controllers/users");

router.get("/", getUsers);
router.get("/:userId", getUser);
router.post("/", createUser);
router.post("/login", loginUser);

module.exports = router;
