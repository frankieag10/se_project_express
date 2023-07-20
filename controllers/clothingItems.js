const ClothingItem = require("../models/clothingItems");

const createItem = (req, res) => {
  console.log(req);
  console.log(req.body);

  const { name, weather, imageUrl, owner } = req.body;

  // Check if the owner field is provided
  if (!owner) {
    return res.status(400).send({ error: "Owner is required" });
  }

  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => {
      console.log(item);
      res.send({ data: item });
    })
    .catch((error) => {
      res
        .status(500)
        .send({ error: "Error creating item", message: error.message });
    });
};

module.exports = {
  createItem,
};
