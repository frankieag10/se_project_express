const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/users");
const { handleError, JWT_SECRET } = require("../utils/config");

// GET /users — returns all users
const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => handleError(req, res, err));
};

// GET /users/:userId - returns a user by _id
const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail()
    .then((data) => res.status(200).send(data))
    .catch((err) => handleError(req, res, err));
};

// POST /users — creates a new user
const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  User.findOne({ email })
    .then((existingUser) => {
      if (existingUser) {
        throw new Error("Email already exists. Please choose a different one.");
      }

      bcrypt.hash(password, 10, (hashErr, hashedPassword) => {
        if (hashErr) {
          handleError(req, res, hashErr);
        } else {
          User.create({ name, avatar, email, password: hashedPassword })
            .then((data) => res.send(data))
            .catch((createErr) => {
              if (createErr.code === 11000) {
                res.status(400).send({
                  message:
                    "Email already exists. Please choose a different one.",
                });
              } else {
                handleError(req, res, createErr);
              }
            });
        }
      });
    })
    .catch((findErr) => handleError(req, res, findErr));
};

// POST /users/login - authenticate a user and return JWT
const loginUser = (req, res) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) =>
      !user
        ? res.status(401).send({ message: "Incorrect email or password" })
        : res.send({
            token: jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "7d" }),
          })
    )
    .catch(() =>
      res.status(401).send({ message: "Incorrect email or password" })
    );
};

// GET /users/me - returns logged in user's data
const getCurrentUser = (req, res) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new Error("User not found");
      }
      res.status(200).send(user);
    })
    .catch((err) => handleError(req, res, err));
};

// PATCH /users/me - updates logged in user's data
const updateUser = (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password", "avatar"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  User.findByIdAndUpdate(req.user._id, req.body, {
    new: true,
    runValidators: true,
  })
    .then((updatedUser) => {
      if (!updatedUser) {
        throw new Error("User not found");
      }
      res.status(200).send(updatedUser);
    })
    .catch((err) => handleError(req, res, err));
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  loginUser,
  getCurrentUser,
  updateUser,
};
