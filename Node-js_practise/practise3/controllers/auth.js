const User = require('../models/user');

exports.getlogin = (req, res, next) => {
  // const isLoggedIn = req.cookies.loggedIn === 'true';
  res.render("auth/login", {
    pageTitle: "Login",
    path: "/login",
    isAuthenticated: false,
  });
};

exports.postlogin = (req, res, next) => {
   User.findById('688746c45697faf81344aae4')
      .then(user => {
        req.session.isLoggedIn = true;
        req.session.user = user;
        req.session.save((err)=>{
          console.log(err)
          res.redirect('/')
        })
      })
      .catch(err => console.log(err));
};

exports.postlogout=(req,res,next)=>{
  req.session.destroy(err=>{
    console.log(err);
    res.redirect('/');
  })
}
