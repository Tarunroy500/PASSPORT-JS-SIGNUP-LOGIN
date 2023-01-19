var express = require("express");
var router = express.Router();
const userSchema = require("./users");
const passport = require("passport");
const localStrategy = require("passport-local");
// const { findOneAndUpdate } = require("./users");
passport.use(new localStrategy(userSchema.authenticate()));

router.get("/", function (req, res, next) {
  res.render("index");
});
router.post("/register", function (req, res, next) {
  const newUser = new userSchema({
    username: req.body.username,
    email: req.body.email,
    number: req.body.number,
    image: req.body.image,
  });

  userSchema.register(newUser, req.body.password).then(function (u) {
    passport.authenticate("local")(req, res, function () {
      res.redirect("/profile");
    });
  });
});
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/login",
  }),
  function (req, res, next) {}
);

router.get("/profile", function (req, res, next) {
  // console.log(req.isAuthenticated())
  // console.log(req.user.email);
  console.log(req.user.image);
  res.render("profile", { user: req.user });
});
router.get("/login", function (req, res, next) {
  res.render("login");
});

router.get("/edit", isLoggedIn, function (req, res, next) {
  // console.log(req.user + " user logged in");
  res.render("edit", { user: req.user });
});
router.post("/edit", isLoggedIn, async function (req, res, next) {
  // await userSchema.findOneAndUpdate({ _id: req.user._id }, req.body);
  const newData = await userSchema.findOneAndUpdate(
    { _id: req.user._id },
    {
      username: req.body.username,
      email: req.body.email,
      number: req.body.number,
      img: req.body.img,
    }
  );
  await newData.save();
  console.log("go to profile page");
  res.redirect("/alluser");
});

router.get("/alluser", isLoggedIn, async function (req, res, next) {
  let allUser = await userSchema.find();
  // console.log(allUser);
  res.render("alluser", { allUser });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/login");
  }
}

module.exports = router;
