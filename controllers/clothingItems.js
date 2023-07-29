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
  console.log("user id: ", req.user._id);
  const { name, weather, imageUrl } = req.body;
  clothingItem
    .create({ name, weather, imageUrl, owner: req.user._id })
    .then((data) => {
      res.status(StatusCodes.OK).send(data);
    })
    .catch((err) => {
      handleError(req, res, err);
    });
};

const deleteClothingItem = (req, res) => {
  const { itemId } = req.params;

  clothingItem
    .findById(itemId)
    .orFail()
    .then((item) => {
      if (!item.owner.equals(req.user._id)) {
        return res
          .status(StatusCodes.FORBIDDEN)
          .send({ message: "You do not have permission to delete this item" });
      }

      return clothingItem.findByIdAndDelete(itemId);
    })
    .then((data) => {
      res.status(StatusCodes.OK).send(data.toJSON());
    })
    .catch((err) => {
      handleError(req, res, err);
    });
};

module.exports = { getClothingItem, createClothingItem, deleteClothingItem };
