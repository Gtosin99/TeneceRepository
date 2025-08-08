const Products = require("../models/product");
const { validationResult } = require("express-validator");
const path = require("path");
const fs = require("fs");
const file = require('../util/file')

exports.getProducts = (req, res, next) => {
  Products.find({ userId: req.user._id })
    // this helps to retrive other tables related to our productin this case it wil use the userid in our product data and fetch all the user data .populate(userId)
    .then((products) => {
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin List",
        path: "/admin/products",
        name: " ",
        isAuthenticated: req.session.isLoggedIn,
        isindex:3
      }); //function from express that uses default templating engine listed in app.js
      //also used to pass content into the template
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const price = req.body.price;
  const description = req.body.description;
  const image = req.file;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "/admin/add-product",
      editing: false,
      hasError: true,
      product: { title, price, description },
      errors: errors.array(),
      isAuthenticated: req.session.isLoggedIn,
      csrfToken: req.csrfToken(),
    });
  }

  // Handle missing image
  if (!image) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "/admin/add-product",
      editing: false,
      hasError: true,
      product: { title, price, description },
      errors: [{ param: "image", msg: "Attached file is not a valid image" }],
      isAuthenticated: req.session.isLoggedIn,
      csrfToken: req.csrfToken(),
    });
  }

  // const imageUrl = path.join('images', image.filename).replace(/\\/g, '/');

  const imageFilename = Date.now() + "-" + image.originalname;
  const imagePath = path.join("images", imageFilename);

  fs.writeFile(imagePath, image.buffer, (err) => {
    if (err) {
      console.error("Error saving file:", err);
      return next(err);
    }

    const imageUrl = imagePath.replace(/\\/g, "/");

    const product = new Products({
      title,
      price,
      description,
      imageUrl,
      userId: req.user,
    });

    product
      .save()
      .then((result) => {
        res.redirect("/admin/products");
      })
      .catch((err) => {
        console.error("❌ Error saving product:", err);
        next(err); // triggers 500 handler
      });
  });
};

exports.getAddProduct = (req, res, next) => {
  // if(!req.session.isLoggedIn){    //this is to protect the route from users who are not logged in
  //   return res.redirect('/auth/login')
  // }
  const error = validationResult(req);
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
    isAuthenticated: req.session.isLoggedIn,
    errors: [],
    product: {
      title: "",
      imageUrl: "",
      price: "",
      description: "",
    },
    hasError: false,
  });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit; //checks if edit is a query in the path
  const error = validationResult(req);

  if (!editMode) {
    return res.redirect("/");
  }
  const prodId = req.params.productId;
  Products.findById(prodId)
    .then((product) => {
      if (!product) {
        return res.redirect("/");
      }

      return res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: editMode,
        product: product,
        isAuthenticated: req.session.isLoggedIn,
        errors: [],
        hasError: true,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postEditProduct = (req, res, next) => {
  const id = req.body.id;
  const updatedTitle = req.body.title;
  const image = req.file; //this is how to extract the image from the req.body
  const updatedPrice = req.body.price;
  const updatedDescription = req.body.description;
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      editing: true,
      isAuthenticated: req.session.isLoggedIn,
      errors: error.array(),
      product: {
        _id: id,
        title: updatedTitle,
        price: updatedPrice,
        description: updatedDescription,
      },
      hasError: true,
    });
  }

  Products.findById(id)
    .then((product) => {
      if (!product) {
        return res.redirect("/admin/products"); // Or show a 404 page
      }
      if (product.userId.toString() !== req.user._id.toString()) {
        return res.redirect("/");
      }
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.description = updatedDescription;
      if (image) {
        file.deletefile(product.imageUrl)
        product.imageUrl = image.path;
      }
      return product.save().then(() => res.redirect("/admin/products"));
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.DeleteProducts = (req, res, next) => {
  const id = req.params.productId;

  Products.findById(id)
    .then(product => {
      if (!product) {
        const error = new Error('Product not found.');
        error.httpStatusCode = 404;
        throw error;
        
      }

      // Delete associated image
      file.deletefile(product.imageUrl);

      // Delete the product only if it belongs to the logged-in user
      return Products.deleteOne({ _id: id, userId: req.user._id });
    })
    .then(() => {
      res.status(200).json({message:'Deleted Successfully'})
    })
    .catch(err => {
      res.status(500).json({message:'Failed to Delete'})
      console.log(err)
    });
};

