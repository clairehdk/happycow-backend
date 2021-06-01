const express = require("express");
const cors = require("cors");
const router = express.Router();
router.use(cors());

const places = require("../assets/places.json");

function distance(lat1, lon1, lat2, lon2, unit) {
  var radlat1 = (Math.PI * lat1) / 180;
  var radlat2 = (Math.PI * lat2) / 180;
  var theta = lon1 - lon2;
  var radtheta = (Math.PI * theta) / 180;
  var dist =
    Math.sin(radlat1) * Math.sin(radlat2) +
    Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
  if (dist > 1) {
    dist = 1;
  }
  dist = Math.acos(dist);
  dist = (dist * 180) / Math.PI;
  dist = dist * 60 * 1.1515;
  if (unit == "K") {
    dist = dist * 1.609344;
  }
  if (unit == "N") {
    dist = dist * 0.8684;
  }
  return dist;
}

// Get All places

router.get("/places", (req, res) => {
  try {
    // let results = places.limit(100).skip(0);
    res.status(200).json(places.slice(0, 50));
  } catch (e) {
    res.status(400).json(e);
  }
});

router.post("/location", async (req, res) => {
  try {
    const { currLat, currLong } = req.fields;
    const placesNearMe = [];
    let count = 0;
    if (currLat && currLong) {
      for (var i = 0; i < places.length; i++) {
        // if this location is within 0.1KM of the user, add it to the list
        if (
          distance(
            currLat,
            currLong,
            places[i].location.lat,
            places[i].location.lng,
            "K"
          ) <= 10
        ) {
          placesNearMe.push(places[i]);
          count += 1;
        }
      }
      res.status(200).json({ count, placesNearMe });
    } else {
      res.status(400).json("Veuillez renseigner vos coordonnées");
    }
  } catch (e) {
    res.status(400).json(e);
  }
});

module.exports = router;
