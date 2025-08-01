const Products = require("../models/product");
const Order = require("../models/order");

exports.getProducts = (req, res, next) => {
  Products.find()
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "Products",
        path: "/products",
        name: "shop",
        isAuthenticated: req.session.isLoggedIn
      }); //function from express that uses default templating engine listed in app.js
      //also used to pass content into the template
    })
    .catch((err) =>{
      const error = new Error(err)
      error.httpStatusCode = 500
      return next(error)
    })
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId; //to extract product id from the path
  Products.findById(prodId)
    .then((product) => {
      res.render("shop/product-details", {
        prods: product,
        pageTitle: product.title,
        path: "/products", 
      isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch((err) =>{
      const error = new Error(err)
      error.httpStatusCode = 500
      return next(error)
    })
};

exports.getIndex = (req, res, next) => {
  Products.find() //moongose function which will give all the data in th db
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
        name: "shop",
        isAuthenticated: req.session.isLoggedIn,
        csrfToken:req.csrfToken()
      }); //function from express that uses default templating engine listed in app.js
      //also used to pass content into the template
    })
    .catch((err) =>{
      const error = new Error(err)
      error.httpStatusCode = 500
      return next(error)
    })
};

exports.getCart = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      const products = user.cart.items.filter(p => p.productId !== null);
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products: products,
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch((err) =>{
      const error = new Error(err)
      error.httpStatusCode = 500
      return next(error)
    })
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Products.findById(prodId)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then((result) => res.redirect("/cart"))
    .catch((err) =>{
      const error = new Error(err)
      error.httpStatusCode = 500
      return next(error)
    })
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
  res.render("shop/checkout", { path: "/checkout", pageTitle: "Checkout" ,
     isAuthenticated: req.session.isLoggedIn
    });
};

exports.getOrders = (req, res, next) => {
  Order.find({'user.userId':req.user._id})
    .then((orders) => {
      res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Orders",
        orders: orders,
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch((err) =>{
      const error = new Error(err)
      error.httpStatusCode = 500
      return next(error)
    })
};

exports.postCartDeleteItem = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .delete1(prodId)
    .then(() => {
      res.redirect("/cart");
    })
    .catch((err) =>{
      const error = new Error(err)
      error.httpStatusCode = 500
      return next(error)
    });
};

exports.postOrder = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      const products = user.cart.items.map((i) => {
        return { quantity: i.quantity, product: { ...i.productId._doc } };
      });
      const order = new Order({
        user: {
          email:req.user.email,
          userId: req.user
        },
        products: products,
      });
      return order.save();
    })
    .then((order) => {
      req.user.clearcart();
    })
    .then((result) => {
      res.redirect("/orders");
    })
    .catch((err) =>{
      const error = new Error(err)
      error.httpStatusCode = 500
      return next(error)
    })
};
