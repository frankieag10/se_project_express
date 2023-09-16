const { StatusCodes } = require("http-status-codes");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/users");
const { JWT_SECRET } = require("../utils/config");
const { ERROR_409, ERROR_401 } = require("../utils/errors");
const NotFoundError = require("../errors/not-found-error");
const UnauthorizedError = require("../errors/unauthorized-error");

// Create a new user
const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  // Check if the email already exists
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        // Hash the password
        bcrypt.hash(password, 10).then((hash) => {
          // Create the user
          User.create({ name, avatar, email, password: hash })
            .then(() => {
              res.status(201).send({ name, email, avatar });
            })
            .catch((err) => {
              handleError(req, res, err);
            });
        });
      } else {
        // User already exists
        res.status(ERROR_409).send({ message: "User already exists" });
      }
    })
    .catch(() => {
      next(new UnauthorizedError("You are not allowed to make changes"));
    });
};

// Login user
const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findUserByCredentials(email, password);
    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "7d" });
    return res.status(StatusCodes.OK).send({ token, user: user._id });
  } catch (err) {
    next(new NotFoundError("Incorrect email or password: 401"));
  }
};

// Get current user
const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .orFail()
    .then((user) => res.status(StatusCodes.OK).send(user))
    .catch(() => next(new NotFoundError("User ID not found")));
};

// Update user information
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
    .catch(() => next(new NotFoundError("User ID not found")));
};

module.exports = {
  createUser,
  loginUser,
  getCurrentUser,
  updateUser,
};
