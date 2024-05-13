const Campground = require("../models/campground");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary } = require("../cloudinary");

const MAX_IMAGES_PER_CAMPGROUND = 3;
const ITEMS_PER_PAGE = 10;

module.exports.index = async (req, res) => {
  const page = +req.query.page || 1;
  const totalCampgrounds = await Campground.countDocuments({});
  const totalPages = Math.ceil(totalCampgrounds / ITEMS_PER_PAGE);
  const skip = (page - 1) * ITEMS_PER_PAGE;
  const allCampgrounds = await Campground.find({});

  const campgrounds = await Campground.find({})
    .skip(skip)
    .limit(ITEMS_PER_PAGE);

  res.render("campgrounds/index", {
    campgrounds,
    allCampgrounds,
    totalPages,
    currentPage: page,
  });
};

module.exports.renderNewForm = async (req, res) => {
  res.render("campgrounds/new");
};

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

module.exports.deleteCampground = async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  req.flash("success", "Successfully deleted a campground!");
  res.redirect("/campgrounds");
};