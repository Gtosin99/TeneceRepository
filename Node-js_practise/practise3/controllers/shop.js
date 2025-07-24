const Products = require("../models/product");

exports.getProducts = (req, res, next) => {
  Products.findAll()
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "Shop",
        path: "/products",
        name: "shop",
      }); //function from express that uses default templating engine listed in app.js
      //also used to pass content into the template
    })
    .catch((err) => console.log(err));
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId; //to extract product id from the path
  Products.findByPk(prodId)
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
  Products.findAll()
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
    .then((cart) => {
      return cart.getProducts().then((cartProducts) => {
        console.log(JSON.stringify(cartProducts, null, 2));

        res.render("shop/cart", {
          cart: cartProducts,
          pageTitle: "Your Cart",
          path: "/cart",
          products: cartProducts,
        });
      });
    })
    .catch((err) => console.log(err));
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  let fetchedcart;
  let newquantity = 1;
  //const quantity = req.body.quantity;
  req.user
    .getCart()
    .then((cart) => {
      fetchedcart = cart;
      return cart.getProducts({ where: { id: prodId } });
    })
    .then((products) => {
      let product;
      if (products.length > 0) {
        product = products[0];
      }
      if (product) {
        const oldquantity = product.cartitem.quantity;
        newquantity = oldquantity + 1;
        return product;
      }
      return Products.findByPk(prodId);
    })
    .then((product) => {
      return fetchedcart.addProduct(product, {
        through: { quantity: newquantity },
      });
    })
    .then(() => {
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", { path: "/checkout", pageTitle: "Checkout" });
};

exports.getOrders = (req, res, next) => {
  req.user
    .getOrders({ include: ['products'] })
    .then(orders=>{
      res.render("shop/orders", { path: "/orders", pageTitle: "Orders" ,orders:orders});
    })
    .catch(err=>console.log(err))
  
};

exports.postCartDeleteItem = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .getCart()
    .then((cart) => {
      return cart.getProducts({ where: { id: prodId } });
    })
    .then((products) => {
      const product = products[0];
      return product.cartitem.destroy();
    })
    .then(() => {
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));
};

exports.postOrder = (req, res, next) => {
  let fetchedcart;
  req.user
    .getCart()
    .then((cart) => {
      fetchedcart=cart
      return cart.getProducts()
    })
    .then((products) => {
      return req.user
        .createOrder()
        .then((order) => {
          return order.addProducts(
            products.map((product) => {
              product.orderitem = { quantity: product.cartitem.quantity };
              return product;
            })
          )
        })
        .catch((err) => console.log(err));
    })
    .then((result) => {
      return  fetchedcart.setProducts(null)  // to remove froducts from cart
    })
    .then(()=>{
            res.redirect("/orders");
    })
    .catch((err) => console.log(err));
};
