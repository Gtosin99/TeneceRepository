const User = require('../models/user');
const bcrypt = require('bcryptjs')

exports.getlogin = (req, res, next) => {
  // const isLoggedIn = req.cookies.loggedIn === 'true';
  res.render("auth/login", {
    pageTitle: "Login",
    path: "/login",
    isAuthenticated: false,
  });
};

exports.postlogin = (req, res, next) => {
  const { email, password } = req.body;
   User.findOne({email:email})
      .then(user => {
        if(!user){
          return res.redirect('/auth/login')
        }
        bcrypt.compare(password, user.password)          //for comparing the passwords
          .then(result=>{     // the result is either true or false if the passwords match
            if (result){
              req.session.isLoggedIn = true;
              req.session.user = user;
              return req.session.save((err)=>{
              console.log(err)
              res.redirect('/')
              })
            }
            return res.redirect('/auth/login')
          })
          .catch(err=>res.redirect('/auth/login'))
      })
      .catch(err => console.log(err));
};

exports.getSignup = (req, res, next) => {
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    isAuthenticated: false
  });
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email
  const password = req.body.password
  const confirmPassword = req.body.confirmPassword
  User.findOne({email: email})
    .then(userDoc => {
      if (userDoc) {
        return res.redirect('/auth/login') // redirect to login page
        }
        return bcrypt.hash(password, 12)
          .then(hashedpassword=>{
          const user = new User({
          email: email,
          password: hashedpassword,
          cart: {items:  [] }
          });
          return user.save()
          })
          .then(result => {
          res.redirect('/auth/login')
          })
    }).catch(err=>console.log(err))
};


exports.postlogout=(req,res,next)=>{
  req.session.destroy(err=>{
    console.log(err);
    res.redirect('/');
  })
}
