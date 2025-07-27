const Products = require("../models/product");

exports.getProducts = (req, res, next) => {
  Products.fetchall()
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "Products",
        path: "/products",
        name: "shop",
      }); //function from express that uses default templating engine listed in app.js
      //also used to pass content into the template
    })
    .catch((err) => console.log(err));
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId; //to extract product id from the path
  Products.findbyId(prodId)
    .then((product) => {
      res.render("shop/product-details", {
        prods: product,
        pageTitle: product.title,
        path: "/products",
      });
    })
    .catch((err) => console.log(err));
};

exports.getIndex = (req, res, next) => {
  Products.fetchall()
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
        name: "shop",
      }); //function from express that uses default templating engine listed in app.js
      //also used to pass content into the template
    })
    .catch((err) => console.log(err));
};

exports.getCart = (req, res, next) => {
  req.user
    .getCart()
    .then(products => {
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: products
      });
    })
    .catch(err => console.log(err));
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Products.findbyId(prodId).then(product => {
    return req.user.addToCart(product)
  }).then(result=>res.redirect('/cart'))
    .catch(err=>console.log(err))
  // let fetchedcart;
  // let newquantity = 1;
  // //const quantity = req.body.quantity;
  // req.user
  //   .getCart()
  //   .then((cart) => {
  //     fetchedcart = cart;
  //     return cart.getProducts({ where: { id: prodId } });
  //   })
  //   .then((products) => {
  //     let product;
  //     if (products.length > 0) {
  //       product = products[0];
  //     }
  //     if (product) {
  //       const oldquantity = product.cartitem.quantity;
  //       newquantity = oldquantity + 1;
  //       return product;
  //     }
  //     return Products.findByPk(prodId);
  //   })
  //   .then((product) => {
  //     return fetchedcart.addProduct(product, {
  //       through: { quantity: newquantity },
  //     });
  //   })
  //   .then(() => {
  //     res.redirect("/cart");
  //   })
  //   .catch((err) => console.log(err));
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", { path: "/checkout", pageTitle: "Checkout" });
};

exports.getOrders = (req, res, next) => {
  req.user
    .getOrders()
    .then(orders=>{
      res.render("shop/orders",
        {path: "/orders",
         pageTitle: "Orders" ,
         orders:orders});
    })
    .catch(err=>console.log(err))
  
};

exports.postCartDeleteItem = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .delete(prodId)
    .then(() => {
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));
};

exports.postOrder = (req, res, next) => {
  let fetchedcart;
  req.user
    .addOrder()
    .then((result)=>{
            res.redirect("/orders");
    })
    .catch((err) => console.log(err));
};
