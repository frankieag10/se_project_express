const { StatusCodes } = require("http-status-codes");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/users");
const { handleError } = require("../utils/config");
const { JWT_SECRET } = require("../utils/config");

const createUser = async (req, res) => {
  const { name, avatar, email, password } = req.body;

  if (password.length < 8) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send({ message: "Password must be at least 8 characters long." });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      avatar,
      email,
      password: hashedPassword,
    });
    return res
      .status(StatusCodes.OK)
      .send({ user: user._id, email: user.email });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(StatusCodes.CONFLICT).send({
        message: "Email already exists. Please choose a different one.",
      });
    }
    return handleError(req, res, err);
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findUserByCredentials(email, password);
    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "7d" });
    return res.status(StatusCodes.OK).send({ token, user: user._id });
  } catch (err) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .send({ message: "Incorrect email or password" });
  }
};

const getCurrentUser = (req, res) =>
  User.findById(req.user._id)
    .orFail()
    .then((user) => res.status(StatusCodes.OK).send(user))
    .catch((err) => handleError(req, res, err));

const updateUser = (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "avatar"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send({ error: "Invalid updates!" });
  }

  return User.findByIdAndUpdate(req.user._id, req.body, {
    new: true,
    runValidators: true,
  })
    .orFail()
    .then((updatedUser) => res.status(StatusCodes.OK).send(updatedUser))
    .catch((err) => handleError(req, res, err));
};

module.exports = {
  createUser,
  loginUser,
  getCurrentUser,
  updateUser,
};
