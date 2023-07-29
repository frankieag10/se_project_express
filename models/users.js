const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, minLength: 2, maxLength: 30 },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator(value) {
        return validator.isURL(value);
      },
      message: "You must enter a valid URL",
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(value) {
        return validator.isEmail(value);
      },
      message: "You must enter a valid email address",
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

UserSchema("save", function handlePasswordHash(next) {
  const user = this;

  if (!user.isModified("password")) {
    return next();
  }

  return bcrypt
    .hash(user.password, 10)
    .then((hashedPassword) => {
      user.password = hashedPassword;
      next();
    })
    .catch((err) => {
      throw new Error(err);
    });
});

UserSchema.statics.findUserByCredentials = function findUser(email, password) {
  return this.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        throw new Error("Incorrect email or password");
      }

      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          throw new Error("Incorrect email or password");
        }

        return user;
      });
    });
};

module.exports = mongoose.model("User", UserSchema);
