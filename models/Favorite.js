const mongoose = require("mongoose");

const Favorite = mongoose.model("Favorite", {
  placeId: mongoose.Schema.Types.ObjectId,
  name: String,
  thumbnail: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = Favorite;
