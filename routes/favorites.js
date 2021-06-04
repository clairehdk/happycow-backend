const express = require("express");
const formidable = require("express-formidable");
const router = express.Router();
const cors = require("cors");
router.use(cors());
router.use(formidable());
const mongoose = require("mongoose");

const places = require("../assets/places.json");

// Import des modèles

const User = require("../models/User");
const Favorite = require("../models/Favorite");
const isAuthenticated = require("../middlewares/isAuthenticated");

// Creation d'un favoris
router.post("/fav/add", isAuthenticated, async (req, res) => {
  try {
    const { name, thumbnail, placeId } = req.fields;
    // console.log(req.fields);
    const newFav = new Favorite({
      placeId: placeId,
      name: name,
      thumbnail: thumbnail,
      user: req.user._id,
    });
    await newFav.save();
    const user = await User.findById(req.user._id);
    let tab = user.favorites;
    tab.push(newFav._id);
    await User.findByIdAndUpdate(req.user._id, {
      favorites: tab,
    });
    res.status(200).json(newFav);

    // }
    // else {
    //   res.status(400).json("Favoris déjà présent.");
    // }
  } catch (e) {
    console.log(e.message);
    res.status(400).json(e.message);
  }
});

// Récupérer les favoris liés au user

router.post("/user/favs", isAuthenticated, async (req, res) => {
  const { userId } = req.fields;
  try {
    const favs = await Favorite.find({ user: userId }).populate({
      path: "user",
    });
    // console.log(favs);
    res.json(favs);
  } catch (e) {
    res.status(400).json(e.message);
  }
});

// Supprimer un favoris

router.post("/fav/remove", isAuthenticated, async (req, res) => {
  try {
    if (String(req.fields.userId) === String(req.user._id)) {
      await Favorite.findByIdAndDelete(req.fields.id);
      const user = await User.findById(req.user._id);
      let tab = user.favorites;
      let fav = tab.indexOf(req.fields.id);
      tab.splice(fav, 1);
      await User.findByIdAndUpdate(req.user._id, {
        favorites: tab,
      });
      res.status(200).json("Votre favoris a bien été supprimé");
    } else {
      res.status(401).json("Vous n'êtes pas autorisés à faire cela");
    }
  } catch (e) {
    res.status(400).json(e.message);
  }
});

module.exports = router;
