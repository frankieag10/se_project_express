const { StatusCodes } = require("http-status-codes");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/users");
const { JWT_SECRET } = require("../utils/config");
const { ERROR_409, ERROR_401 } = require("../utils/errors");
const NotFoundError = require("../errors/not-found-error");
const UnauthorizedError = require("../errors/unauthorized-error");
const BadRequestError = require("../errors/bad-request-error");
const ConflictError = require("../errors/conflict-error");

// Create a new user
// POST /users — creates a new user
const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        bcrypt.hash(password, 10).then((hash) => {
          User.create({ name, avatar, email, password: hash })
            .then(() => {
              res.status(201).send({ name, email, avatar });
            })
            .catch((err) => {
              if (err.name === "ValidationError") {
                next(new BadRequestError("Invalid data"));
              } else {
                next(err);
              }
            });
        });
      } else {
        throw new ConflictError(
          `The request wasn't completed because of a conflict with the resource's current state.`
        );
      }
    })
    .catch((err) => {
      next(err);
    });
};

// Login user
const loginUser = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      res.send({
        token: jwt.sign({ _id: user._id }, JWT_SECRET, {
          expiresIn: "7d",
        }),
      });
    })
    .catch(() => {
      next(new UnauthorizedError("The Email or user name is wrong: 401"));
    });
};

// Get current user
const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;
  console.log(userId);
  User.findById(userId)
    .orFail()
    .then((data) => {
      if (!data) {
        throw new NotFoundError("No user with matching ID found");
      }
      res.send(data);
    })
    .catch(() => {
      next(new NotFoundError("The User Id not found"));
    });
};

const updateUser = (req, res, next) => {
  const userId = req.user._id;
  const { name, avatar } = req.body;
  User.findByIdAndUpdate(
    userId,
    { $set: { name, avatar } },
    { new: true, runValidators: true }
  )
    .orFail()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError("Invalid data"));
      } else {
        next(err);
      }
    });
};

module.exports = {
  createUser,
  loginUser,
  getCurrentUser,
  updateUser,
};
