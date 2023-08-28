const mongoose = require("mongoose");
const shortId = require("shortid");

// Create a model to insert data into the database
const shortUrlSchema = new mongoose.Schema({
  original_url: {
    type: String,
    required: true,
  },
  short_url: {
    type: String,
    required: true,
    // shortId.generate will generate a new unique shortid every time data is provided into database
    default: shortId.generate,
  },
});

module.exports = mongoose.model("shortUrl", shortUrlSchema);
