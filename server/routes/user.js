const express = require("express");
const mongoose = require("mongoose");
const bycrypt = require("bcrypt");
const router = express.Router();
const User = require("../models/user.model");
const auth = require("../middleware/auth");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// for generating secrete token
// require('crypto').randomBytes(64).toString('hex')

// router.post("/login",  (req, res) => {
//   res.json({"data":req.body})
// })

router.post("/register", async (req, res) => {
  try {
    const { password, email, passwordCheck, displayName } = req.body;

    const existingUser = await User.findOne({ email: email });
    // console.log(existingUser);
    // console.log(req.body);
    //   Validating Register Details

    // Checking if user has submitted the necessary information
    if (!password || !email || !passwordCheck || !displayName) {
      res.status(400).json({ msg: "Not all the fields has been filled" });
    }

    // Checking if the Password Length is more than 5
    else if (password.length < 5) {
      res
        .status(400)
        .json({ msg: "Password should be more than 5 characters long" });
    }

    // Checking if the Password Length is more than 5
    else if (!email.includes("@")) {
      res.status(400).json({ msg: "Email should an @ symbol" });
    }

    // Checking if password and passwordCheck are the same
    else if (password != passwordCheck) {
      res
        .status(400)
        .json({ msg: "Enter the same password twice for verification" });
    }

    // Checking if user dosen't have an account with the same email
    else if (existingUser) {
      res
        .status(400)
        .json({ msg: "An account with the same email already exists" });
    } else {
      // Encrypting or Hashing User password before storing it in the database
      const salt = await bycrypt.genSalt();
      const passwordHash = await bycrypt.hash(password, salt);

      // Creating a newUser variable which is ready to be saved in the db
      const newUser = new User({
        email: email,
        password: passwordHash,
        displayName: displayName,
      });

      // Saving the user details in the db
      const savedUser = await newUser
        .save()
        .then(() => res.json("user added!"))
        .catch((err) => res.status(400).json("Error: " + err));
    }
  } catch (error) {
    res.status(500).json({ error });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ msg: "Not all fields have been entered." });
    const user = await User.findOne({ email: email });
    if (!user)
      return res
        .status(400)
        .json({ msg: "No account with this email has been registered." });
    const isMatch = await bycrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials." });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({
      token,
      user: { id: user._id, displayName: user.displayName },
    });
  } catch (err) {
    res.status(500).json({ err });
  }
});

// Check if token is valid
router.post("/tokenIsValid", async (req, res) => {
  try {
    const token = req.header("x-auth-token");
    if (!token) return res.json(false);
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (!verified) return res.json(false);
    const user = await User.findById(verified.id);
    if (!user) return res.json(false);
    return res.json(true);
  } catch (err) {
    res.status(500).json({ err });
  }
});

router.get("/", auth, async (req, res) => {
  const user = await User.findById(req.user);
  res.json({
    displayName: user.displayName,
    id: user._id,
  });
});

module.exports = router;
