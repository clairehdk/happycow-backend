const express = require("express");
const formidable = require("express-formidable");
const app = express();
const mongoose = require("mongoose");
app.use(formidable());

// MongoDB

mongoose.connect("mongodb://localhost:27017/happy-cow", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

// Routes

const placesRoutes = require("./routes/places");
const usersRoutes = require("./routes/users");
const favRoutes = require("./routes/favorites");
app.use(placesRoutes);
app.use(usersRoutes);
app.use(favRoutes);

app.all("*", (req, res) => {
  res.status(404).json("Page not found");
});

app.listen(process.env.PORT || 3001, () => {
  console.log("Server started");
});
