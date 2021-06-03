const express = require("express");
const formidable = require("express-formidable");
const router = express.Router();
const cors = require("cors");
router.use(cors());
router.use(formidable());

const places = require("../assets/places.json");

// Import des modèles

const User = require("../models/User");
const Favorite = require("../models/Favorite");

// Creation d'un favoris
router.post("/fav/add", async (req, res) => {
  try {
    const { name, thumbnail, placeId } = req.fields;
    // const isPresent;
    // for (i=0; i<places.length; i++ )
    // { }
    // if (!isPresent) {
    if (name) {
      const newFav = new Favorite({
        placeId,
        name,
        thumbnail,
      });
      await newFav.save();
      const user = await User.findById(req.user._id);
      let tab = user.favorites;
      tab.push(newFav._id);
      await User.findByIdAndUpdate(req.user._id, {
        favorites: tab,
      });
      res.status(200).json(newFav);
    } else {
      res.status(400).json("Champs manquants");
    }
    // } else {
    //   res.status(400).json("Favoris déjà présent.");
    // }
  } catch (e) {
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
