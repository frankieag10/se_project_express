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
router.get("/items", (req, res, next) => {
  console.log("GET /items"); // Added console.log
  getClothingItem(req, res, next);
});

// POST /items — creates a new item
router.post("/items", auth, (req, res, next) => {
  console.log("POST /items"); // Added console.log
  clothingItemValidation(req, res, () => createClothingItem(req, res, next));
});

// DELETE /items/:itemId — deletes an item by _id
router.delete("/items/:itemId", auth, (req, res, next) => {
  console.log("DELETE /items/:itemId"); // Added console.log
  idValidation(req, res, () => deleteClothingItem(req, res, next));
});

// PUT /items/:itemId/likes — like an item
router.put("/items/:itemId/likes", auth, (req, res, next) => {
  console.log("PUT /items/:itemId/likes"); // Added console.log
  idValidation(req, res, () => likeItem(req, res, next));
});

// DELETE /items/:itemId/likes — unlike an item
router.delete("/items/:itemId/likes", auth, (req, res, next) => {
  console.log("DELETE /items/:itemId/likes"); // Added console.log
  idValidation(req, res, () => dislikeItem(req, res, next));
});

module.exports = router;
