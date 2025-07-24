const Products = require("../models/product");

exports.getProducts = (req, res, next) => {
  req.user.getProducts()
    .then((products) => {
    res.render("admin/products", {
      prods: products,
      pageTitle: "Admin List",
      path: "/admin/products",
      name: " ",
    }); //function from express that uses default templating engine listed in app.js
    //also used to pass content into the template
  }).catch(err=>console.log(err))
};

exports.postAddProduct = (req, res, next) => {
  //can use the same path name but as long as the method (get,post) is different
  const title = req.body.title;
  const imageUrl = req.body.imageURL; //these are the values from the form the name must match what is written in your form
  const price = req.body.price;
  const description = req.body.description;

  req.user.createProduct({
    title: title,
    price: price,
    description: description,
    imageUrl:imageUrl,
  })
  .then(result=>{
    res.redirect('/admin/products')
  })
  .catch(err=>console.log(err))
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
  req.user.getProducts({where:{id:prodId}})
  .then((products) => {
    const product = products[0];
    if (!product) {
      return res.redirect("/");
    }

    return res.render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      editing: editMode,
      product: product,
    });
  }).catch(err=>console.log(err));
};

exports.postEditProduct = (req,res,next)=>{
  const id = req.body.id
  const updatedTitle = req.body.title;
  const updatedImageUrl = req.body.imageURL;
  const updatedPrice = req.body.price;
  const updatedDescription = req.body.description;
  Products.findByPk(id).then(
    product => {
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.description = updatedDescription;
      product.imageURL = updatedImageUrl;
      return product.save(); 
    })
    .then(()=>res.redirect('/admin/products'))
    .catch(err=>console.log(err))
}

exports.postDeleteProducts=(req,res,next)=>{
  const id=req.body.id
  Products.findByPk(id).then((product)=>{
     if (!product) {
        console.log('Product not found');
        return res.redirect('/admin/products'); // Redirect even if not found
      }
    return product.destroy()
  }).then(()=>res.redirect('/admin/products'))
  .catch(err=>console.log(err))
}
