const User = require("../models/User");

const isAuthenticated = async (req, res, next) => {
  if (req.headers.authorization) {
    try {
      const user = await User.findOne({
        token: req.headers.authorization.replace("Bearer ", ""),
      });
      if (!user) {
        res.status(401).json("Unauthorized");
      } else {
        req.user = user;
        // console.log(req.user);
        next();
      }
    } catch (e) {
      res.status(400).json(e.message);
    }
  } else {
    res.status(401).json("Unauthorized");
  }
};
module.exports = isAuthenticated;
