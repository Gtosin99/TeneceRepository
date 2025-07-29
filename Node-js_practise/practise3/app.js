const express = require("express");
const parser = require("body-parser");
const path = require("path");
const session=require('express-session')
const stores = require('connect-mongodb-session')(session)


const adminroutes = require("./routes/admin");
const shoproutes = require("./routes/shop");
const errors = require("./controllers/errors");
const mongoconnect = require("./util/database").mongoconnect;
const User = require("./models/user");
const mongoose = require("mongoose");
const auth = require('./routes/auth')
const cookieParser = require('cookie-parser');





const app = express();

const store = new stores({
  uri:"mongodb+srv://tosinakindele826:12345@cluster0.otcx1mi.mongodb.net/shop?retryWrites=true&w=majority&tls=true",
  collection: 'sessions',
})

app.set("view engine", "ejs");
app.set("views", "views");

app.use(parser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(session({
  secret: 'secret',
  resave: false,   //session will not be saved on every req done 
  saveUninitialized: false, //session will not be created for new user
  store: store
}))

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use("/admin", adminroutes.routes);
app.use("/auth",auth)
app.use(shoproutes);

app.use(errors.error404);

mongoose
  .connect(
    "mongodb+srv://tosinakindele826:12345@cluster0.otcx1mi.mongodb.net/shop?retryWrites=true&w=majority&tls=true"
  )
  .then((result) => {
    User.findOne().then((user) => {
      if (!user) {
        const user = new User({
          name: "Tosin",
          email: "tosinakindele826@gmail.com",
          cart: {
            items: [],
          },
        });
        user.save();
      }
    });

    app.listen(3000);
  })
  .catch((err) => console.log(err));
