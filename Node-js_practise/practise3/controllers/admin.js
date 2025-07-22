const Products = require("../models/product");

exports.getProducts = (req, res, next) => {
  Products.fetchAll((products) => {
    res.render("admin/products", {
      prods: products,
      pageTitle: "Admin List",
      path: "/admin/products",
      name: " ",
    }); //function from express that uses default templating engine listed in app.js
    //also used to pass content into the template
  });
};

exports.postAddProduct = (req, res, next) => {
  //can use the same path name but as long as the method (get,post) is different
  const title = req.body.title;
  const imageUrl = req.body.imageURL; //these are the values from the form the name must match what is written in your form
  const price = req.body.price;
  const description = req.body.description;
  const product = new Products(null,title, imageUrl, description, price);
  product.save(() => {
    // Redirect only AFTER saving is done
    return res.redirect("/");
  });
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
  Products.findById(prodId, (product) => {
    if (!product) {
      return res.redirect("/");
    }

    return res.render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      editing: editMode,
      product: product,
    });
  });
};

exports.postEditProduct = (req,res,next)=>{
  const id = req.body.id
  const updatedTitle = req.body.title;
  const updatedImageUrl = req.body.imageURL;
  const updatedPrice = req.body.price;
  const updatedDescription = req.body.description;
  const updatedproducts= new Products(id,updatedTitle,updatedImageUrl,updatedDescription,updatedPrice)
  updatedproducts.save(() => {
    // Redirect only AFTER saving is done
    return res.redirect("/admin/products");
  })
}

exports.postDeleteProducts=(req,res,next)=>{
  const id=req.body.id
  Products.delete(id,()=>{
    return res.redirect("/admin/products");
  })
}
