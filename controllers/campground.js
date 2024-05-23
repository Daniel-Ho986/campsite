const Campground = require("../models/campground");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary } = require("../cloudinary");

const MAX_IMAGES_PER_CAMPGROUND = 3;
const ITEMS_PER_PAGE = 12;

module.exports.index = async (req, res) => {
  const page = +req.query.page || 1;
  const totalCampgrounds = await Campground.countDocuments({});
  const totalPages = Math.ceil(totalCampgrounds / ITEMS_PER_PAGE);
  const skip = (page - 1) * ITEMS_PER_PAGE;
  const campgrounds = await Campground.find({})
    .skip(skip)
    .limit(ITEMS_PER_PAGE);

  if (req.xhr) {
    return res.status(200).json({ campgrounds, totalCampgrounds, totalPages });
  } else {
    res.render("campgrounds/index", {
      campgrounds,
      totalPages,
      currentPage: page,
    });
  }
};

// Search:
// Allows searching campgrounds by title, description, or location
// Supports pagination for displaying campgrounds
module.exports.searchCampgrounds = async (req, res) => {
  const { query, page = 1 } = req.query;
  let campgrounds = [];
  let totalCampgrounds = 0;

  if (query) {
    const searchRegex = new RegExp(query, "i");
    campgrounds = await Campground.find({
      $or: [
        { title: searchRegex },
        { description: searchRegex },
        { location: searchRegex },
      ],
    });
    totalCampgrounds = campgrounds.length;
  } else {
    totalCampgrounds = await Campground.countDocuments({});
    campgrounds = await Campground.find({});
  }

  const totalPages = Math.ceil(totalCampgrounds / ITEMS_PER_PAGE);
  const skip = (page - 1) * ITEMS_PER_PAGE;
  const paginatedCampgrounds = campgrounds.slice(skip, skip + ITEMS_PER_PAGE);

  res
    .status(200)
    .json({ campgrounds: paginatedCampgrounds, totalCampgrounds, totalPages });
};

module.exports.renderNewForm = async (req, res) => {
  res.render("campgrounds/new");
};

// CRUD Operations

// Create: 
// Adds a new campground with geolocation data from Mapbox,
// checks for title uniqueness, limits images to 3
module.exports.createCampground = async (req, res, next) => {
  const geoData = await geocoder
    .forwardGeocode({
      query: req.body.campground.location,
      limit: 1,
    })
    .send();

  const existingCampground = await Campground.findOne({
    title: req.body.campground.title,
  });
  if (existingCampground) {
    req.flash("error", "A campground with the same title already exists.");
    return res.redirect("/campgrounds/new");
  }

  const campground = new Campground(req.body.campground);
  campground.geometry = geoData.body.features[0].geometry;
  campground.author = req.user._id;

  if (req.files.length > MAX_IMAGES_PER_CAMPGROUND) {
    req.flash("error", `Maximum ${MAX_IMAGES_PER_CAMPGROUND} images allowed.`);
    return res.redirect("/campgrounds/new");
  }

  campground.images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));

  await campground.save();
  req.flash("success", "Successfully made a new campground!");
  res.redirect(`/campgrounds/${campground._id}`);
};

// Read:
// Displays campground details and renders forms for creating and editing campgrounds
module.exports.showCampground = async (req, res) => {
  const campground = await Campground.findById(req.params.id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("author");
  if (!campground) {
    req.flash("error", "Cannot find that campground!");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/show", { campground });
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground) {
    req.flash("error", "Cannot find that campground!");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/edit", { campground });
};

// Update:
// Updates campground details, including image management with Cloudinary
module.exports.updateCampground = async (req, res) => {
  const { id } = req.params;
  const existingCampground = await Campground.findOne({
    title: req.body.campground.title,
  });

  if (existingCampground && existingCampground._id != id) {
    req.flash("error", "A campground with the same title already exists.");
    return res.redirect(`/campgrounds/${id}/edit`);
  }

  const campground = await Campground.findByIdAndUpdate(id, {
    ...req.body.campground,
  });

  let totalImages = campground.images.length;

  if (req.files) {
    const imgs = req.files.map((f) => ({ url: f.path, filename: f.filename }));
    campground.images.push(...imgs);
    totalImages += req.files.length;
  }

  if (req.body.deleteImages && req.body.deleteImages.length > 0) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await campground.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });

    totalImages -= req.body.deleteImages.length;
  }

  if (totalImages > MAX_IMAGES_PER_CAMPGROUND) {
    req.flash("error", `Maximum ${MAX_IMAGES_PER_CAMPGROUND} images allowed.`);
    return res.redirect(`/campgrounds/${id}/edit`);
  }

  await campground.save();

  req.flash("success", "Successfully updated campground!");
  res.redirect(`/campgrounds/${campground._id}`);
};

// Delete:
// Deletes a campground and its associated images and reviews
module.exports.deleteCampground = async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  req.flash("success", "Successfully deleted a campground!");
  res.redirect("/campgrounds");
};

// Map:
// Renders a map with all campgrounds using Mapbox
module.exports.renderMapPage = async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/map", { campgrounds });
};
