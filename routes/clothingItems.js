const router = require("express").Router();
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
const auth = require("../middlewares/auth");

// GET /items — returns all clothing items
router.get("/items", (req, res) => {
  console.log("GET /items"); // Added console.log
  getClothingItem(req, res);
});

// POST /items — creates a new item
router.post("/items", auth, (req, res) => {
  console.log("POST /items"); // Added console.log
  clothingItemValidation(req, res, () => createClothingItem(req, res));
});

// DELETE /items/:itemId — deletes an item by _id
router.delete("/items/:itemId", auth, (req, res) => {
  console.log("DELETE /items/:itemId"); // Added console.log
  idValidation(req, res, () => deleteClothingItem(req, res));
});

// PUT /items/:itemId/likes — like an item
router.put("/items/:itemId/likes", auth, (req, res) => {
  console.log("PUT /items/:itemId/likes"); // Added console.log
  idValidation(req, res, () => likeItem(req, res));
});

// DELETE /items/:itemId/likes — unlike an item
router.delete("/items/:itemId/likes", auth, (req, res) => {
  console.log("DELETE /items/:itemId/likes"); // Added console.log
  idValidation(req, res, () => dislikeItem(req, res));
});

module.exports = router;
