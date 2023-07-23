const clothingItem = require("../models/clothingItems");
const { handleError } = require("../utils/config");

module.exports.likeItem = (req, res) => {
  clothingItem
    .findByIdAndUpdate(
      req.params.itemId,
      { $addToSet: { likes: req.user._id } },
      { new: true }
    )
    .orFail()
    .then((data) => res.status(200).send(data))
    .catch((err) => {
      handleError(req, res, err);
    });
};

module.exports.dislikeItem = (req, res) =>
  clothingItem
    .findByIdAndUpdate(
      req.params.itemId,
      { $pull: { likes: req.user._id } },
      { new: true }
    )
    .orFail()
    .then((data) => res.status(200).send(data))
    .catch((err) => {
      handleError(req, res, err);
    });
