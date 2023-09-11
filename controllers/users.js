const { StatusCodes } = require("http-status-codes");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/users");
//const { handleError } = require("../utils/config");
const { JWT_SECRET } = require("../utils/config");
const { ERROR_409, ERROR_401 } = require("../utils/errors");

const createUser = async (req, res, next) => {
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
    next(err);
  }
};

const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findUserByCredentials(email, password);
    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "7d" });
    return res.status(StatusCodes.OK).send({ token, user: user._id });
  } catch (err) {
    next(err);
  }
};

const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .orFail()
    .then((user) => res.status(StatusCodes.OK).send(user))
    .catch((err) => next(err));
};

const updateUser = (req, res, next) => {
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

  User.findByIdAndUpdate(req.user._id, req.body, {
    new: true,
    runValidators: true,
  })
    .orFail()
    .then((updatedUser) => res.status(StatusCodes.OK).send(updatedUser))
    .catch((err) => next(err));
};

module.exports = {
  createUser,
  loginUser,
  getCurrentUser,
  updateUser,
};
