const express = require("express");
const formidable = require("express-formidable");
const router = express.Router();
const uid2 = require("uid2");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const cors = require("cors");
router.use(cors());
router.use(formidable());

const User = require("../models/User");

// SIGN UP

router.post("/signup", async (req, res) => {
  try {
    const { username, email, password, vegstatus, birthyear } = req.fields;

    const userMail = await User.findOne({ email: email });
    const userName = await User.findOne({ username: username });

    if (username || email || password || birthyear) {
      if (userMail) {
        res.status(400).json("This mail already has an account.");
      } else if (userName) {
        res.status(400).json("Username already used");
      } else {
        const token = uid2(64);
        const salt = uid2(64);
        const hash = SHA256(password + salt).toString(encBase64);

        const newUser = new User({
          email,
          username,
          vegstatus,
          birthyear,
          token,
          salt,
          hash,
        });

        await newUser.save();
        res.status(200).json({
          _id: newUser.id,
          token: newUser.token,
          email: newUser.email,
          username: newUser.email,
        });
      }
    } else {
      res.status(400).json("Missing parameters.");
    }
  } catch (e) {
    res.status(400).json(e);
  }
});

// SIGN IN

router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.fields;
    if (email && password) {
      const userMail = await User.findOne({ email: email });
      if (userMail) {
        if (
          SHA256(password + userMail.salt).toString(encBase64) === userMail.hash
        ) {
          res.json({
            _id: userMail._id,
            token: userMail.token,
            email: userMail.email,
          });
        } else {
          res.status(401).json("Unauthorized");
        }
      } else {
        res.status(401).json("Unauthorized");
      }
    } else {
      res.status(400).json("Missing parameters.");
    }
  } catch (e) {
    res.status(400).json(e);
  }
});

module.exports = router;
