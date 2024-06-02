const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator")
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const passport = require("passport");

exports.sign_up_get = (req, res, next) => {
  res.render("sign_up_form")
}

exports.sign_up_post = [
  body("first_name")
  .trim()
  .isLength({ min: 1})
  .escape()
  .withMessage("First name must be specified")
  .isAlphanumeric()
  .withMessage("First name has non-alphanumeric characters."),
  body("last_name")
  .trim()
  .isLength({ min: 1})
  .escape()
  .withMessage("Last name must be specified")
  .isAlphanumeric()
  .withMessage("Last name has non-alphanumeric characters."),
  body("email")
  .trim()
  .isLength({ min: 1 })
  .escape()
  .withMessage("Email must be specified")
  .isEmail()
  .withMessage("Email is not valid"),
  body("password")
  .trim()
  .isLength({ min: 5 })
  .escape()
  .withMessage("Password must have minimum 5 characters"),
  body("confirm_password")
  .custom((value, { req }) => {
    return value === req.body.password
  })
  .withMessage("Passwords do not match"),
  
  asyncHandler(async(req, res, next) => {
    const errors = validationResult(req);
    const user = new User({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
    })

    if (!errors.isEmpty()) {
      res.render("sign_up_form", {
        user: user,
        errors: errors.array()
      })
    } else {
      bcrypt.hash(req.body.password, 10, async(err, hashedPassword) => {
        const user = new User({
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          email: req.body.email,
          password: hashedPassword,
          is_member: false,
          is_admin: req.body.is_admin ? true : false
        })
        await user.save();
        res.redirect("/login");
      })
    }
  })
]

exports.login_get = asyncHandler(async(req, res, next) => {
  res.render("login_form", { error: req.session.messages ? req.session.messages[0] : undefined });
})

exports.login_post = [
  (req, res, next) => {
    req.session.messages = [];
    next();
  },
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureMessage: true,
  })
]

exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/")
  })
}

exports.member_form_get = (req, res, next) => {
  res.render("member_form");
}

exports.member_form_post = [
  body("member_code")
  .trim()
  .isLength({ min: 1 })
  .escape()
  .withMessage("Member code must be specified")
  .custom((value, { req }) => {
    return value === "member"
  })
  .withMessage("Member code is incorrect"),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
       res.render("member_form", {
        errors: errors.array()
       });
    } else {
      const user = new User({
        is_member: true,
        _id: req.user.id
      })

      await User.findByIdAndUpdate(req.user.id, user);
      res.redirect("/")
    }
  })
]