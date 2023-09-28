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

// GET /items — returns all clothing items
router.get("/items", (req, res) => {
  console.log("GET /items"); // Added console.log
  getClothingItem(req, res);
});

// POST /items — creates a new item
router.post("/", auth, (req, res) => {
  console.log("POST /items"); // Added console.log
  clothingItemValidation(req, res, () => createClothingItem(req, res));
});

// DELETE /items/:itemId — deletes an item by _id
router.delete("/:itemId", auth, (req, res) => {
  console.log("DELETE /items/:itemId"); // Added console.log
  idValidation(req, res, () => deleteClothingItem(req, res));
});

// PUT /items/:itemId/likes — like an item
router.put("/:itemId/likes", auth, (req, res) => {
  console.log("PUT /items/:itemId/likes"); // Added console.log
  idValidation(req, res, () => likeItem(req, res));
});

// DELETE /items/:itemId/likes — unlike an item
router.delete("/:itemId/likes", auth, (req, res) => {
  console.log("DELETE /items/:itemId/likes"); // Added console.log
  idValidation(req, res, () => dislikeItem(req, res));
});

module.exports = router;
