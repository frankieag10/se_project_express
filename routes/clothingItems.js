const router = require("express").Router();
const auth = require("../middlewares/auth");

const {
  getClothingItem,
  createClothingItem,
  deleteClothingItem,
} = require("../controllers/clothingItems");

const { likeItem, dislikeItem } = require("../controllers/likes");
const {
  clothingItemValidation,
  idValidation,
} = require("../middlewares/validation");

// GET / items — returns all clothing items
router.get("/items", getClothingItem);

// POST / items — creates a new item
router.post("/items", clothingItemValidation, auth, createClothingItem);

// DELETE / items /: itemId — deletes an item by _id
router.delete("/items/:itemId", idValidation, auth, deleteClothingItem);

// PUT /items/:itemId/likes — like an item
router.put("/items/:itemId/likes", idValidation, auth, likeItem);

// DELETE /items/:itemId/likes — unlike an item
router.delete("/items/:itemId/likes", idValidation, auth, dislikeItem);

module.exports = router;
