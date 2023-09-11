const { StatusCodes } = require("http-status-codes");
const clothingItem = require("../models/clothingItems");
const { handleError } = require("../utils/config");
const { ERROR_403 } = require("../utils/errors");

const getClothingItem = (req, res, next) => {
  clothingItem
    .find({})
    .then((data) => {
      res.status(StatusCodes.OK).send(data);
    })
    .catch((err) => {
      next(err); // Pass the error to the error-handling middleware
    });
};

const createClothingItem = (req, res, next) => {
  console.log("user id: ", req.user._id);
  const { name, weather, imageUrl } = req.body;
  clothingItem
    .create({ name, weather, imageUrl, owner: req.user._id })
    .then((data) => {
      res.status(StatusCodes.CREATED).send(data);
    })
    .catch((err) => {
      next(err); // Pass the error to the error-handling middleware
    });
};

const deleteClothingItem = (req, res, next) => {
  const { itemId } = req.params;
  const loggedinUserId = req.user._id;
  clothingItem
    .findOne({ _id: itemId })
    .orFail()
    .then((item) => {
      if (item.owner.equals(loggedinUserId)) {
        console.log("Owner is authorized to delete.");
        clothingItem
          .findByIdAndDelete(itemId)
          .orFail()
          .then((data) => {
            res.status(StatusCodes.OK).send(data.toJSON());
          })
          .catch((err) => {
            console.error(err);
            next(err);
          });
      } else {
        res.status(StatusCodes.FORBIDDEN).send({
          message: "You are not authorized to delete other user's item",
        });
      }
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = { getClothingItem, createClothingItem, deleteClothingItem };
