const express = require("express");
const parser = require("body-parser");
const path = require("path");
const session = require("express-session");
const stores = require("connect-mongodb-session")(session);
const flash = require("connect-flash");
const multer = require("multer");

const adminroutes = require("./routes/admin");
const shoproutes = require("./routes/shop");
const errors = require("./controllers/errors");
const mongoconnect = require("./util/database").mongoconnect;
const User = require("./models/user");
const mongoose = require("mongoose");
const auth = require("./routes/auth");
const cookieParser = require("cookie-parser");
const csrf = require("csurf");
const { ppid } = require("process");
const fs = require('fs');


const app = express();

const imagesDir = path.join(__dirname, 'images');

if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir) }

const store = new stores({
  uri: "mongodb+srv://tosinakindele826:12345@cluster0.otcx1mi.mongodb.net/shop?retryWrites=true&w=majority&tls=true",
  collection: "sessions",
});

// const filestorage = multer.diskStorage({
//   destination: (req, file, cb) => {   //this is where the file will be stored
//     cb(null, "images");
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + '-' + file.originalname);    //this is the name of the file
//   },
// });


const storage = multer.memoryStorage(); // store in memory

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
      cb(null, true);
      } else {
        cb(null, false);
        }
}
const csrfprotection = csrf();

const upload = multer({ storage: storage, fileFilter: fileFilter });

app.set("view engine", "ejs");
app.set("views", "views");

app.use(parser.urlencoded({ extended: false }));
// app.use(multer({ storage:filestorage,fileFilter:fileFilter }).single("image"));
app.use(upload.single('image')); // still parses multipart data
app.use(express.static(path.join(__dirname, "public")));
app.use('/images',express.static(path.join(__dirname, "images")));
app.use(
  session({
    secret: "secret",
    resave: false, //session will not be saved on every req done
    saveUninitialized: false, //session will not be created for new user
    store: store,
  })
);

app.use(flash());
app.use(csrfprotection);

app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken(); // Now csrfToken is available in all EJS files
  res.locals.isAuthenticated = req.session.isLoggedIn;
  next();
});

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch((err) => {
      console.error("❌ Error in user session middleware:", err);
      next(err);
    });
});

app.use("/admin", adminroutes.routes);
app.use("/auth", auth);
app.use(shoproutes);
app.get("/500", errors.error500);
app.use(errors.error404);

app.use((error, req, res, next) => {
  //special error handling middleware
  console.log(error)
  res.redirect("/500");
});

mongoose
  .connect(
    "mongodb+srv://tosinakindele826:12345@cluster0.otcx1mi.mongodb.net/shop?retryWrites=true&w=majority&tls=true"
  )
  .then((result) => {
    app.listen(3000);
  })
  .catch((err) => console.log(err));
