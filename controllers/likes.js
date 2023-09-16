const clothingItem = require("../models/clothingItems");
const { handleError } = require("../utils/config");
const UnauthorizedError = require("../errors/unauthorized-error");

module.exports.likeItem = async (req, res) => {
  try {
    const data = await clothingItem
      .findByIdAndUpdate(
        req.params.itemId,
        { $addToSet: { likes: req.user._id } },
        { new: true }
      )
      .orFail();
    res.status(200).send(data);
  } catch (err) {
    handleError(req, res, err);
  }
};

module.exports.dislikeItem = (req, res, next) =>
  clothingItem
    .findByIdAndUpdate(
      req.params.itemId,
      { $pull: { likes: req.user._id } },
      { new: true }
    )
    .orFail()
    .then((data) => res.status(200).send(data))
    .catch(() => {
      next(new UnauthorizedError("You are not allowed to make change"));
    });
