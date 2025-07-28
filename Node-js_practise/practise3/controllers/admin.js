const Products = require("../models/product");

exports.getProducts = (req, res, next) => {
  Products.find()
 // this helps to retrive other tables related to our productin this case it wil use the userid in our product data and fetch all the user data .populate(userId)
    .then((products) => {
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin List",
        path: "/admin/products",
        name: " ",
      }); //function from express that uses default templating engine listed in app.js
      //also used to pass content into the template
    })
    .catch((err) => console.log(err));
};

exports.postAddProduct = (req, res, next) => {
  //can use the same path name but as long as the method (get,post) is different
  const title = req.body.title;
  const imageUrl = req.body.imageURL; //these are the values from the form the name must match what is written in your form
  const price = req.body.price;
  const description = req.body.description;
  const product = new Products({
    title: title,
    price: price,
    description: description,
    imageUrl: imageUrl,
    userId:req.user
  });
  product
    .save()
    .then((result) => {
      console.log(result);
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit; //checks if edit is a query in the path
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
      });
    })
    .catch((err) => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
  const id = req.body.id;
  const updatedTitle = req.body.title;
  const updatedImageUrl = req.body.imageURL;
  const updatedPrice = req.body.price;
  const updatedDescription = req.body.description;

  Products.findById(id)
    .then((product) => {
      product.title = updatedTitle;
      product.imageUrl = updatedImageUrl;
      product.price = updatedPrice;
      product.description = updatedDescription;
      return product.save();
    })
    .then(() => res.redirect("/admin/products"))
    .catch((err) => console.log(err));
};

exports.postDeleteProducts = (req, res, next) => {
  const id = req.body.id;

  Products.findByIdAndDelete(id)
    .then((product) => {
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/admin/products");
    });
};

