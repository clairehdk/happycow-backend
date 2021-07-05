const mongoose = require("mongoose");

const Favorite = mongoose.model("Favorite", {
  placeId: Number,
  name: String,
  thumbnail: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = Favorite;
