var express = require("express");
var router = express.Router();
const userSchema = require("./users");
const passport = require("passport");
const localStrategy = require("passport-local");
passport.use(new localStrategy(userSchema.authenticate()));

router.get("/", function (req, res, next) {

  res.render("index");
});
router.post("/register", function (req, res, next) {
  const newUser = new userSchema({
    username: req.body.username,
    email: req.body.email,
    number: req.body.number,
  });

  userSchema.register(newUser, req.body.password).then(function (u) {
    passport.authenticate("local")(req, res, function () {
      res.redirect("/");
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
 
router.get("/profile", isLoggedIn, function (req, res, next) {
  res.render("profile", { user: req.user });
});
router.get("/login", function (req, res, next) {
  res.render("login");
});

router.get("/edit", function (req, res, next) {
  res.render("edit");
});
router.post('/edit', (req, res, next) => {
  const things = new userSchema({
    username:req.body.username,
    email:req.body.email,
    number:req.body.number,

  });
  userSchema.updateOne({username:req.body.username}, things).then(
    () => {
      res.status(201).json({
        message: 'Thing updated successfully!'
      });
    }
    ).catch(
      (error) => {
        res.status(400).json({
          error: error
        });
      }
      );
    });
    
    function isLoggedIn(req, res, next) {
      if (req.isAuthenticated()) {
        return next();
      } else {
        res.redirect("/login");
      }
    }
    
    module.exports = router;
    