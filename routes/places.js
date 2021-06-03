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
          ) <= 5
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

router.post("/adresses", async (req, res) => {
  try {
    const { googleLat, googleLong } = req.fields;
    const placesNearAddress = [];
    let count = 0;
    if (googleLat && googleLong) {
      for (var i = 0; i < places.length; i++) {
        // if this location is within 0.1KM of the user, add it to the list
        if (
          distance(
            googleLat,
            googleLong,
            places[i].location.lat,
            places[i].location.lng,
            "K"
          ) <= 1
        ) {
          placesNearAddress.push(places[i]);
          count += 1;
        }
      }
      res.status(200).json({ count, placesNearAddress });
    } else {
      res.status(400).json("Veuillez renseigner une adresse.");
    }
  } catch (e) {
    res.status(400).json(e);
  }
});

// Get place by ID

router.get("/places/:placeId", async (req, res) => {
  try {
    console.log(req.params.placeId);
    // const findPlace = places.find(
    //   (element) => Number(element.placeId) === req.params.placeId
    // );

    const findPlace = places.find(
      (place) => `:${place.placeId}` === req.params.placeId
    );
    console.log(findPlace);
    res.json(findPlace);
  } catch (e) {
    res.status(400).json(e.message);
  }
});

// Get All places

router.get("/", (req, res) => {
  try {
    console.log(req.query);
    const { name, type, limit } = req.query;
    let filters = [];
    if (name || type) {
      for (i = 0; i < places.length; i++) {
        if (places[i].name.includes(name)) {
          filters.push(places[i]);
        }
        if (places[i].type === req.query.type) {
          filters.push(places[i]);
        }
      }
    }
    //   filters = new RegExp(req.query.name, "i");
    //   filters.toString().split(" ");
    // }
    // console.log(req.query.name);
    // let results = places.limit(100).skip(0);
    // const { name } = req.query;
    // let filters = {};
    // const findByName = places.find(
    //   (elem) => elem.name == String(req.query.name)
    // );
    // let index = places[0].name.indexOf("Veganie");
    // console.log(index);

    // console.log(filters);
    // // console.log(index);
    // var findByName = places.filter(function (place) {
    //   return place.name.indexOf(req.query.name) === 1;

    //   filtered = myArray.filter(function (str) { return str.indexOf(PATTERN) === -1; });
    // });

    // console.log(findByName);
    if (filters.length > 1) {
      res.status(200).json(filters.slice(0, limit));
    } else {
      res.status(200).json(places.slice(0, limit));
    }
  } catch (e) {
    res.status(400).json(e);
  }
});

module.exports = router;
