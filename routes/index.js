const router = require("express").Router();
const res = require("express/lib/response");
const clothingItem = require("./clothingItems");

router.use("/items", clothingItem);

router.use((req, res) => {
  res.status(500).send({ message: "Router not found" });
});

module.exports = router;
