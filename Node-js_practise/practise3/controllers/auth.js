const User = require("../models/user");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const sendgrid = require("nodemailer-sendgrid-transport");
const crypto = require("crypto");

const transporter = nodemailer.createTransport(
  sendgrid({
    auth: {
      api_key: "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",
    },
  })
);

exports.getlogin = (req, res, next) => {
  // const isLoggedIn = req.cookies.loggedIn === 'true';

  res.render("auth/login", {
    pageTitle: "Login",
    path: "/login",
    isAuthenticated: false,
    error: req.flash("error")[0],
  });
};

exports.postlogin = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        req.flash("error", "Invalid Email");
        return res.redirect("/auth/login");
      }
      bcrypt
        .compare(password, user.password) //for comparing the passwords
        .then((result) => {
          // the result is either true or false if the passwords match
          if (result) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save((err) => {
              res.redirect("/");
            });
          }
          req.flash("error", "Wrong Password Entered");
          return res.redirect("/auth/login");
        })
        .catch((err) => res.redirect("/auth/login"));
    })
    .catch((err) => console.log(err));
};

exports.getSignup = (req, res, next) => {
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    isAuthenticated: false,
    error: req.flash("error")[0],
  });
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  User.findOne({ email: email })
    .then((userDoc) => {
      if (userDoc) {
        req.flash("error", "Email already used");
        return res.redirect("/auth/login"); // redirect to login page
      }
      return bcrypt
        .hash(password, 12)
        .then((hashedpassword) => {
          const user = new User({
            email: email,
            password: hashedpassword,
            cart: { items: [] },
          });
          return user.save();
        })
        .then((result) => {
          res.redirect("/auth/login");
          return transporter.sendMail({
            to: email,
            from: "tosinosin798@gmail.com",
            subject: "Signup Successfull",
            html: "<h1>Signup Successfull</h1>",
          });
        });
    })
    .catch((err) => console.log(err));
};

exports.postlogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};

exports.getReset = (req, res, next) => {
  res.render("auth/reset", {
    pageTitle: "Reset Password",
    path: "/reset",
    error: req.flash("error")[0],
  });
};

exports.postReset = (req,res,next) => {
  const email = req.body.email

  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect("/auth/reset");
    }
    const token = buffer.toString("hex");
    User.findOne({ email: email })
      .then((user) => {
        if (!user) {
          req.flash("error", "No account with that email found.");
          return res.redirect('/auth/reset')
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();
      })
      .then((result) => {
        transporter.sendMail({
          to: req.body.email,
          from: "tosinosin798@gmail.com",
          subject: "Password reset",
          html: `
              <p>You requested a password reset</p>
              <p>Click this <a href="http://localhost:3000/auth/new-password/${
                token}">link</a> to set a new password</p>
           `
        });
      })
      .catch();
  });
};

exports.getnewpassword = (req,res,next)=>{
  const token = req.params.token
  User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now()
    } })
    .then((user)=>{
      res.render("auth/new-password", {
      pageTitle: "Reset Password",
      path: "/new-password",
      isAuthenticated: false,
      error: req.flash("error")[0],
      userId:user.id.toString(),
      passwordToken:token
  });  
    })
    .catch(err=>console.log(err))
  
}

exports.postnewpassword = (req, res, next) => {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;
  let resetUser;

  User.findOne({
    resetToken: passwordToken,
    resetTokenExpiration: { $gt: Date.now() },
    _id: userId,
  })
    .then((user) => {
      if (!user) {
        req.flash("error", "Password reset token is invalid or expired.");
        return res.redirect("/auth/reset");
      }
      resetUser = user;
      return bcrypt.hash(newPassword, 12);
    })
    .then((hashedPassword) => {
      if (!resetUser) {
        return; // avoid error if user was not found
      }
      resetUser.password = hashedPassword;
      resetUser.resetToken = null;
      resetUser.resetTokenExpiration = undefined;
      return resetUser.save();
    })
    .then((result) => {
      if (result) {
        res.redirect("/auth/login");
      }
    })
    .catch((err) => {
      console.error("Error resetting password:", err);
      res.redirect("/auth/reset");
    });
};

