const Products = require("../models/product");

exports.getProducts = (req, res, next) => {
  Products.fetchall()
    .then((products) => {
    res.render("admin/products", {
      prods: products,
      pageTitle: "Admin List",
      path: "/admin/products",
      name: " ",
    }); //function from express that uses default templating engine listed in app.js
    //also used to pass content into the template
  }).catch(err=>console.log(err))
}

exports.postAddProduct = (req, res, next) => {
  //can use the same path name but as long as the method (get,post) is different
  const title = req.body.title;
  const imageUrl = req.body.imageURL; //these are the values from the form the name must match what is written in your form
  const price = req.body.price;
  const description = req.body.description;
  const product = new Products(title,price,description,imageUrl,null,req.user._id);
  let updating;
    product.save(updating)
  .then(result=>{
    console.log(result)
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
  Products.findbyId(prodId)
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
  }).catch(err=>console.log(err));
};

exports.postEditProduct = (req,res,next)=>{
  const id = req.body.id
  const updatedTitle = req.body.title;
  const updatedImageUrl = req.body.imageURL;
  const updatedPrice = req.body.price;
  const updatedDescription = req.body.description;
 
  const product = new Products(updatedTitle,updatedPrice,updatedDescription,updatedImageUrl,id)
  product.save()
    .then(()=>res.redirect('/admin/products'))
    .catch(err=>console.log(err))
}

exports.postDeleteProducts=(req,res,next)=>{
  const id=req.body.id
  Products.findbyId(id).then((product)=>{
     if (!product) {
        return res.redirect('/admin/products'); // Redirect even if not found
      }else{
    return Products.deletebyId(id).then(()=>res.redirect('/admin/products'))}
  })
  .catch(err=>console.log(err))
}
