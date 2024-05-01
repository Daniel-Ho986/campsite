const express = require("express");
const router = express.Router();
const campgrounds = require("../controllers/campground");
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware");

// Read all campgrounds
router.get("/", catchAsync(campgrounds.index));

// Create new campground
router.get("/new", isLoggedIn, catchAsync(campgrounds.renderNewForm));

// POST route for campground
router.post(
  "/",
  isLoggedIn,
  validateCampground,
  catchAsync(campgrounds.createCampground)
);

// Read a campground
router.get("/:id", catchAsync(campgrounds.showCampground));

// Update a campground
router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(campgrounds.renderEditForm)
);

// PUT route for campground
router.put(
  "/:id",
  isLoggedIn,
  isAuthor,
  validateCampground,
  catchAsync(campgrounds.updateCampground)
);

// DELETE route for campground
router.delete(
  "/:id",
  isLoggedIn,
  isAuthor,
  catchAsync(campgrounds.deleteCampground)
);

module.exports = router;
