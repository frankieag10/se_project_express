const { StatusCodes } = require("http-status-codes");
const clothingItem = require("../models/clothingItems");
const BadRequestError = require("../errors/bad-request-error");
const UnauthorizedError = require("../errors/unauthorized-error");
const NotFoundError = require("../errors/not-found-error");

// GET / items — returns all clothing items
const getClothingItem = (req, res, next) => {
  clothingItem
    .find({})
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => next(err));
};

// POST / items — creates a new item
const createClothingItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  clothingItem
    .create({ name, weather, imageUrl, owner: req.user._id })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError("you are not allowed to create this item"));
      } else {
        next(err);
      }
    });
};

// DELETE / items /: itemId — deletes an item by _id
const deleteClothingItem = (req, res, next) => {
  const { itemId } = req.params;
  const loggedinUserId = req.user._id;
  clothingItem
    .findOne({ _id: itemId })
    .orFail(() => new NotFoundError("The request was Not Found!"))
    .then((item) => {
      // check if the user is the item owner
      if (item.owner.equals(loggedinUserId)) {
        clothingItem
          .findByIdAndDelete(itemId)
          .orFail(() => new NotFoundError("The request was Not Found!"))
          .then((data) => {
            res.status(200).send(data.toJSON());
          })
          .catch((err) => next(err));
      } else {
        throw new ForbiddenError(
          "You are not authorized to delete other user's item"
        );
      }
    })
    .catch((err) => next(err));
};

module.exports = { getClothingItem, createClothingItem, deleteClothingItem };
