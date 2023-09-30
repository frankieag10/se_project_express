const clothingItem = require("../models/clothingItems");
const UnauthorizedError = require("../errors/unauthorized-error");
const NotFoundError = require("../errors/not-found-error");

// PUT / items /: itemId / likes — like an item
module.exports.likeItem = (req, res, next) => {
  clothingItem
    .findByIdAndUpdate(
      req.params.itemId,
      { $addToSet: { likes: req.user._id } },
      { new: true }
    )
    .orFail(() => new NotFoundError("The requested resource Not Found!"))
    .then((data) => res.status(200).send(data))
    .catch((err) => {
      next(err);
    });
};

module.exports.dislikeItem = (req, res, next) => {
  clothingItem
    .findByIdAndUpdate(
      req.params.itemId,
      { $pull: { likes: req.user._id } },
      { new: true }
    )
    .orFail(() => new NotFoundError("The requested resource Not Found!"))
    .then((data) => res.status(200).send(data))
    .catch((error) => {
      console.error(error);
      next(new UnauthorizedError("You are not allowed to make changes"));
    });
};
