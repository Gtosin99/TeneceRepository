const User = require("../models/user");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const sendgrid = require("nodemailer-sendgrid-transport");
const crypto = require("crypto");
const {validationResult} = require('express-validator')

const transporter = nodemailer.createTransport(
  sendgrid({
    auth: {
      api_key: "your-key",
    }
  })
);

exports.getlogin = (req, res, next) => {
  // const isLoggedIn = req.cookies.loggedIn === 'true';
  const errors = validationResult(req)
  res.render("auth/login", {
    pageTitle: "Login",
    path: "/login",
    isAuthenticated: false,
    error: req.flash("error")[0],
    validation:errors.array(),
    oldInput: { email:"", password:"",confirmPassword:"" },
  });
};

exports.postlogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = validationResult(req);
  let fetchedUser; // <-- fix this

  if (!errors.isEmpty()) {
    return res.render("auth/login", {
      pageTitle: "Login",
      path: "/login",
      isAuthenticated: false,
      error: errors.array()[0].msg,
      validation: errors.array(),
      oldInput: { email: email, password: password },
    });
  }

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        req.flash('error', 'Invalid email or password');
        return res.redirect('/auth/login');
      }
      fetchedUser = user; // store user for next then
      return bcrypt.compare(password, user.password);
    })
    .then((doMatch) => {
      if (doMatch) {
        req.session.isLoggedIn = true;
        req.session.user = fetchedUser;
        return req.session.save((err) => {
          if (err) console.log(err);
          res.redirect("/");
        });
      }
      req.flash("error", "Wrong Password Entered");
      return res.redirect("/auth/login");
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/auth/login");
    });
};


exports.getSignup = (req, res, next) => {
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    isAuthenticated: false,
    error: req.flash("error")[0],
    oldInput: { email:"", password:"",confirmPassword:"" },
    validation:[]
  });
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const errors=validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).render("auth/signup", {
      path: "/signup",
      pageTitle: "Signup",
      isAuthenticated: false,
      error: errors.array()[0].msg,
      oldInput: { email:email, password:password,confirmPassword:confirmPassword },
      validation:errors.array()
    })
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

