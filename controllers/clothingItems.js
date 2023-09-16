const { StatusCodes } = require("http-status-codes");
const clothingItem = require("../models/clothingItems");
const UnauthorizedError = require("../errors/unauthorized-error");
const NotFoundError = require("../errors/not-found-error");

const getClothingItem = async (req, res, next) => {
  try {
    const data = await clothingItem.find({});
    res.status(StatusCodes.OK).send(data);
  } catch (error) {
    console.error(error);
    next(new NotFoundError("Data not found"));
  }
};

const createClothingItem = async (req, res, next) => {
  try {
    const { name, weather, imageUrl } = req.body;
    const data = await clothingItem.create({
      name,
      weather,
      imageUrl,
      owner: req.user._id,
    });
    res.status(StatusCodes.CREATED).send(data);
  } catch (error) {
    console.error(error);
    next(new UnauthorizedError("You are not allowed to create this item"));
  }
};

const deleteClothingItem = async (req, res, next) => {
  const { itemId } = req.params;
  const loggedinUserId = req.user._id;

  try {
    const item = await clothingItem.findOne({ _id: itemId }).orFail();

    if (item.owner.equals(loggedinUserId)) {
      console.log("Owner is authorized to delete.");
      const data = await clothingItem.findByIdAndDelete(itemId).orFail();
      res.status(StatusCodes.OK).send(data.toJSON());
    } else {
      res.status(StatusCodes.FORBIDDEN).send({
        message: "You are not authorized to delete other user's item",
      });
    }
  } catch (error) {
    console.error(error);
    next(new UnauthorizedError("You are not allowed to delete this item"));
  }
};

module.exports = { getClothingItem, createClothingItem, deleteClothingItem };
