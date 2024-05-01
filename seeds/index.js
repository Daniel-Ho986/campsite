// Utilies to pre-populate the database
const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const Campground = require("../models/campground");

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

const sample = (arr) => arr[Math.floor(Math.random() * arr.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      author: "6631356486add4676658fc8b",
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      image: "https:/source.unsplash.com/collection/483251",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Assumenda repellendus blanditiis vel autem nihil ipsa corporis sapiente, aperiam ullam recusandae, atque velit officiis eligendi dicta esse possimus. Natus, non reiciendis?",
      price,
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
