const express = require("express");
const parser = require("body-parser");
const path = require("path");

const adminroutes = require("./routes/admin");
const shoproutes = require("./routes/shop");
const errors = require("./controllers/errors");
const mongoconnect = require("./util/database").mongoconnect;
const User = require("./models/user");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(parser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  User.findById("688746c45697faf81344aae4")
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use("/admin", adminroutes.routes);
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
