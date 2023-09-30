const { StatusCodes } = require("http-status-codes");
const clothingItem = require("../models/clothingItems");
const BadRequestError = require("../errors/bad-request-error");
const NotFoundError = require("../errors/not-found-error");
const ForbiddenError = require("../errors/forbidden-error");

// GET / items — returns all clothing items
const getClothingItem = async (req, res, next) => {
  try {
    const data = await clothingItem.find({});
    res.status(200).send(data);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// POST / items — creates a new item
const createClothingItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  clothingItem
    .create({ name, weather, imageUrl, owner: req.user._id })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError("you are not allowed to create this item"));
      } else {
        next(err);
      }
    });
};

// DELETE / items /: itemId — deletes an item by _id
const deleteClothingItem = async (req, res, next) => {
  const { itemId } = req.params;
  const loggedinUserId = req.user._id;

  try {
    const item = await clothingItem
      .findOne({ _id: itemId })
      .orFail(() => new NotFoundError("The requested resource Not Found!"));

    if (item.owner.equals(loggedinUserId)) {
      console.log("Owner is authorized to delete.");
      const data = await clothingItem
        .findByIdAndDelete(itemId)
        .orFail(() => new NotFoundError("The requested resource Not Found!"));
      res.status(StatusCodes.OK).send(data.toJSON());
    } else {
      throw new ForbiddenError(
        "You are not authorized to delete other user's item"
      );
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
};

module.exports = { getClothingItem, createClothingItem, deleteClothingItem };
