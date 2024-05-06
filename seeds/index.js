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
  for (let i = 0; i < 300; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      author: "6631356486add4676658fc8b",
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      description:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Assumenda repellendus blanditiis vel autem nihil ipsa corporis sapiente, aperiam ullam recusandae, atque velit officiis eligendi dicta esse possimus. Natus, non reiciendis?",
      price,
      geometry: {
        type: "Point",
        coordinates: [
          cities[random1000].longitude,
          cities[random1000].latitude,
        ],
      },
      images: [
        {
          url: "https://res.cloudinary.com/df5pg2ohi/image/upload/v1714856584/Campsite/zdnfqhlxvse4ohzxzz3n.jpg",
          filename: "Campsite/zdnfqhlxvse4ohzxzz3n",
        },
        {
          url: "https://res.cloudinary.com/df5pg2ohi/image/upload/v1714760194/Campsite/k4dypxpx822ig0wijswz.jpg",
          filename: "Campsite/k4dypxpx822ig0wijswz",
        },
        {
          url: "https://res.cloudinary.com/df5pg2ohi/image/upload/v1714760194/Campsite/affghktcby2bqvc7tmup.jpg",
          filename: "Campsite/affghktcby2bqvc7tmup",
        },
        {
          url: "https://res.cloudinary.com/df5pg2ohi/image/upload/v1714760195/Campsite/ok2duhfs21tmj7odwesw.jpg",
          filename: "Campsite/ok2duhfs21tmj7odwesw",
        },
      ],
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
