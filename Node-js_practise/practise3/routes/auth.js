const express = require("express");
const router = express.Router();
const authcontroller = require("../controllers/auth");
const { check, body } = require("express-validator");
const User = require("../models/user");

router.get("/login", authcontroller.getlogin);
router.get("/signup", authcontroller.getSignup);
router.post("/login",
            check('email')
            .isEmail().withMessage('Please Enter a valid Email Address').normalizeEmail(),
            check('password').isLength({min:5}).withMessage('Password Must be at least 5 characters')
            .isAlphanumeric().withMessage('Password must contain only numbers and letters').trim()
            , authcontroller.postlogin);
router.post(
  "/signup",
  check("email")
    .isEmail()
    .withMessage("Please enter a valid email.")
    .custom((value, { req }) => {
      return User.findOne({ email: value }) 
        .then((userDoc) => {
          if (userDoc) {
            return Promise.reject(
              "Email exists already, please pick a different one"
            );
          }
        });
    }).normalizeEmail(),
  check(
    "password",
    "Please enter a password with only numbers and text and at least 5 characters"
  )
    .isLength({ min: 5 })
    .isAlphanumeric().trim(),
  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Passwords do not match");
    }
    return true;
  }),
  authcontroller.postSignup
);
router.post("/logout", authcontroller.postlogout);
router.get("/reset", authcontroller.getReset);
router.post("/reset", authcontroller.postReset);
router.get("/new-password/:token", authcontroller.getnewpassword);
router.post("/new-password", authcontroller.postnewpassword);

module.exports = router;
