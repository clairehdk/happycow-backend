const mongoose = require("mongoose");

const User = mongoose.model("User", {
  email: {
    unique: true,
    type: String,
  },
  username: {
    unique: true,
    type: String,
  },
  favorites: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Favorite",
    },
  ],
  //   adress: [{ longitude: Number, latitude: Number }],
  veg_status: {
    type: String,
  },
  birth_year: { type: String },
  token: String,
  hash: String,
  salt: String,
});

module.exports = User;
