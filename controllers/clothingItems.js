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
      console.error(err);

      handleError(req, res, err);
    });
};

const deleteClothingItem = (req, res) => {
  const { itemId } = req.params;
  console.log("item id:", itemId);
  clothingItem
    .findByIdAndDelete(itemId)
    .orFail()
    .then((data) => {
      res.status(200).send(data.toJSON());
    })
    .catch((err) => {
      console.error(err);

      handleError(req, res, err);
    });
};

module.exports = { getClothingItem, createClothingItem, deleteClothingItem };
