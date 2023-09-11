const clothingItem = require("../models/clothingItems");

module.exports.likeItem = async (req, res, next) => {
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
    next(err);
  }
};

module.exports.dislikeItem = async (req, res, next) => {
  try {
    const data = await clothingItem
      .findByIdAndUpdate(
        req.params.itemId,
        { $pull: { likes: req.user._id } },
        { new: true }
      )
      .orFail();
    res.status(200).send(data);
  } catch (err) {
    next(err);
  }
};
