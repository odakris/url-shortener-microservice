require("dotenv").config();
const express = require("express");
const cors = require("cors");
// Import Mongoose
const mongoose = require("mongoose");
// Import shortUrl model
const shortUrl = require("./models/shortUrl");
// Import isDNS function
const { isDNS } = require("./functions/isDNS");
const app = express();

// Connect to database
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

// To parse the data coming from POST requests
app.use(express.urlencoded({ extended: false }));

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Route that search, find or create short_url
app.post("/api/shorturl/", async (req, res) => {
  try {
    // Check that provided url is valid
    let dnsResults = await isDNS(req.body.url);

    if (dnsResults === "Valid_URL") {
      // Search provided url in database
      let data = await shortUrl.find({ original_url: req.body.url });

      // if not in database
      if (data.length === 0) {
        // Create new short_url
        await shortUrl.create({ original_url: req.body.url });
        // Get new short_url
        data = await shortUrl.find({ original_url: req.body.url });
      }

      // Print json results
      res.json({
        original_url: data[0].original_url,
        short_url: data[0].short_url,
      });
    } else {
      // If invalid url
      res.json({
        error: "Invalid url",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
});

// Route that redirect to corresponding url while valid short_url provided
app.get("/api/shorturl/:short_url?", async (req, res) => {
  // Get short_url provided
  let short_url = req.params.short_url;

  // Search for short_url in database
  let data = await shortUrl.find({ short_url: short_url });

  data.length === 0
    ? // if not in database
      res.json({ error: "This short url is not in our database" })
    : // else redirect to corresponding original_url
      res.redirect(data[0].original_url);
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
