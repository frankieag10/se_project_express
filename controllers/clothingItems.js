const { StatusCodes } = require("http-status-codes");
const clothingItem = require("../models/clothingItems");
const { handleError } = require("../utils/config");

const getClothingItem = (req, res) => {
  clothingItem
    .find({})
    .then((data) => {
      res.status(StatusCodes.OK).send(data);
    })
    .catch((err) => {
      handleError(req, res, err);
    });
};

const createClothingItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  clothingItem
    .create({ name, weather, imageUrl, owner: req.user._id })
    .then((data) => {
      res.status(StatusCodes.CREATED).send(data);
    })
    .catch((err) => {
      handleError(req, res, err);
    });
};

const deleteClothingItem = (req, res) => {
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
            handleError(req, res, err);
          });
      } else {
        res.status(StatusCodes.FORBIDDEN).send({
          message: "You are not authorized to delete other user's item",
        });
      }
    })
    .catch((err) => {
      handleError(req, res, err);
    });
};

module.exports = { getClothingItem, createClothingItem, deleteClothingItem };
