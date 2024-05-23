// Review Schema
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the review schema with fields for body, rating, and author
const ReviewSchema = new Schema({
  body: String,
  rating: Number,
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
});

module.exports = mongoose.model("Review", ReviewSchema);
