const clothingItem = require("../models/clothingItems");
const { handleError } = require("../utils/config");

const getClothingItem = (req, res) => {
  clothingItem
    .find({})
    .then((data) => {
      res.status(200).send(data);
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
      res.status(200).send(data);
    })
    .catch((err) => {
      handleError(req, res, err);
    });
};

const deleteClothingItem = (req, res) => {
  const { itemId } = req.params;

  clothingItem
    .findById(itemId)
    .then((item) => {
      if (!item) {
        throw new Error("Item not found");
      }
      if (!item.owner.equals(req.user._id)) {
        res
          .status(403)
          .send({ message: "You do not have permission to delete this item" });
        return;
      }

      return clothingItem.findByIdAndDelete(itemId);
    })
    .then((data) => {
      if (!data) return;
      res.status(200).send(data.toJSON());
    })
    .catch((err) => {
      handleError(req, res, err);
    });
};

module.exports = { getClothingItem, createClothingItem, deleteClothingItem };
