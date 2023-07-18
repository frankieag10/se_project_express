const ClothingItem = require("../models/clothingItems");

const createItem = (req, res) => {
  console.log(req);
  console.log(req.body);

  const { name, weather, imageURL } = req.body;

  ClothingItem.create({ name, weather, imageURL })
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
