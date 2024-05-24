// if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
// }

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const methodOverride = require("method-override");
const ExpressError = require("./utils/ExpressError");
const User = require("./models/user");
const MongoStore = require('connect-mongo');
const ejsMate = require("ejs-mate");
const mongoSanitize = require("express-mongo-sanitize");

const app = express();

const dbUrl = "mongodb://127.0.0.1:27017/campsite";

// Connect MongoDB with Mongoose
mongoose
  .connect(dbUrl)
  .then(() => {
    console.log("Mongo Connection Open!");
  })
  .catch((err) => {
    console.log("Mongo Error!");
    console.log(err);
  });

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

// Middleware configuration
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true })); // (express parse)
app.use(methodOverride("_method")); // Override method for PUT and DELETE in form
app.use(express.static(path.join(__dirname, "public")));
app.use(mongoSanitize());

// Session configuration
const secret = process.env.SECRET;
const store = MongoStore.create({
  mongoUrl: dbUrl,
  touchAfter: 24 * 60 * 60,
  crypto: {
    secret,
  },  
});

store.on("error", function(e) {
  console.log("SESSION STORE ERROR", e)
})

const sessionConfig = {
  store,
  name: "session",
  secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

app.use(session(sessionConfig));
app.use(flash());

// Passport configuration
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
// Store a user in the session
passport.serializeUser(User.serializeUser()); 
// Get a user out of the session
passport.deserializeUser(User.deserializeUser()); 

// Flash and locals middleware
// Allow access to 'currentUser', 'success', 'error' in templates
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// Routes
const indexRoutes = require('./routes/index');
app.use('/', indexRoutes);

// Home
app.get("/", (req, res) => {
  res.render("home");
});

// Error handling
app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Something went wrong!";
  res.status(statusCode).render("error", { err });
});

// Start server
const port = 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
