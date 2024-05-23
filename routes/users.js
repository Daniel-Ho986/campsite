const express = require("express");
const router = express.Router();
const users = require("../controllers/users");
const passport = require("passport");
const catchAsync = require("../utils/catchAsync");
const { storeReturnTo, isLoggedIn } = require("../middleware");
const User = require("../models/user");

// Route to display registration form and register a user
router
  .route("/register")
  .get(users.renderRegister)
  .post(catchAsync(users.register));

// Route to display login form and login a user
router
  .route("/login")
  .get(users.renderLogin)
  .post(
    // use the storeReturnTo middleware to save the returnTo value from session to res.locals
    storeReturnTo,
    // passport.authenticate logs the user in and clear req.session
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    users.login
  );

// Route to display logout form
router.get("/logout", users.logout);

module.exports = router;
