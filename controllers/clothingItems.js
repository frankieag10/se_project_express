const { StatusCodes } = require("http-status-codes"); // Moved up
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
    .orFail(new Error("Item not found"))
    .then((item) => {
      if (!item.owner.equals(req.user._id)) {
        res
          .status(StatusCodes.FORBIDDEN)
          .send({ message: "You do not have permission to delete this item" });
        return Promise.reject();
      }

      return clothingItem.findByIdAndDelete(itemId);
    })
    .then((data) => {
      if (!data) {
        res
          .status(StatusCodes.NOT_FOUND)
          .send({ message: "No item found to delete" });
        return;
      }
      res.status(StatusCodes.OK).send(data.toJSON());
    })
    .catch((err) => {
      handleError(req, res, err);
    });
};

module.exports = { getClothingItem, createClothingItem, deleteClothingItem };
