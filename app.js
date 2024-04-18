const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const Campground = require("./models/campground");

// Connect Database with Mongoose
mongoose
  .connect("mongodb://127.0.0.1:27017/campsite")
  .then(() => {
    console.log("Mongo Connection Open!");
  })
  .catch((err) => {
    console.log("Mongo Error!");
    console.log(err);
  });

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const app = express();
const port = 3000;

// Middleware (ejs)
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true })); // Middleware (express parse)
app.use(methodOverride("_method")); // Override method for PUT and DELETE in form

app.get("/", (req, res) => {
  res.render("home");
});

// Read all campgrounds
app.get("/campgrounds", async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
});

// Create new campground
app.get("/campgrounds/new", async (req, res) => {
  res.render("campgrounds/new");
});

// POST route
app.post("/campgrounds", async (req, res) => {
  const campground = new Campground(req.body.campground);
  await campground.save();
  res.redirect(`/campgrounds/${campground._id}`);
});

// Read a campground
app.get("/campgrounds/:id", async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  res.render("campgrounds/show", { campground });
});

// Update a campground
app.get("/campgrounds/:id/edit", async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  res.render("campgrounds/edit", { campground });
});

// PUT route
app.put("/campgrounds/:id", async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndUpdate(id, {
    ...req.body.campground,
  });
  res.redirect(`/campgrounds/${campground._id}`);
});

// DELETE route
app.delete("/campgrounds/:id", async (req, res) => {
    const { id } = req.params; 
    await Campground.findByIdAndDelete(id);
    res.redirect("/campgrounds");
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
