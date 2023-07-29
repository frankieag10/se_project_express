const router = require("express").Router();
const auth = require("../middleware/auth"); // Import your auth middleware

const {
  getClothingItem,
  createClothingItem,
  deleteClothingItem,
} = require("../controllers/clothingItems");

const { likeItem, dislikeItem } = require("../controllers/likes");

// GET / items — returns all clothing items
router.get("/items", getClothingItem);

// POST / items — creates a new item
router.post("/items", auth, createClothingItem); // Protect route with auth

// DELETE / items /: itemId — deletes an item by _id
router.delete("/items/:itemId", auth, deleteClothingItem); // Protect route with auth

// PUT /items/:itemId/likes — like an item
router.put("/items/:itemId/likes", auth, likeItem); // Protect route with auth

// DELETE /items/:itemId/likes — unlike an item
router.delete("/items/:itemId/likes", auth, dislikeItem); // Protect route with auth

module.exports = router;
