const fs = require("fs");
const path = require("path");

const p = path.join(
  path.dirname(process.mainModule.filename),
  "data",
  "cart.json"
);

module.exports = class Cart {
  static addProduct(id, productPrice, cb) {
    const price = +productPrice; // convert to number
    fs.readFile(p, (err, fileContents) => {
      let cart = { products: [], totalprice: 0 };

      if (!err && fileContents.length > 0) {
        try {
          cart = JSON.parse(fileContents);
        } catch (e) {
          console.error("Error parsing cart.json:", e);
        }
      }

      // Ensure cart.products is always an array
      if (!Array.isArray(cart.products)) {
        cart.products = [];
      }

      const existingProductIndex = cart.products.findIndex(
        (prod) => prod.id === id
      );
      const existingProduct = cart.products[existingProductIndex];

      if (existingProduct) {
        // Update quantity
        existingProduct.qty += 1;
        cart.products[existingProductIndex] = existingProduct;
      } else {
        // Add new product
        cart.products.push({ id: id, qty: 1 });
      }

      cart.totalprice = cart.products.reduce((total, prod) => {
        return total + prod.qty * price; // Each product qty * price
      }, 0);

      fs.writeFile(p, JSON.stringify(cart), (err) => {
        if (err) console.error("Error writing cart.json:", err);
        if (cb) cb();
      });
    });
  }
  static delete(id) {
    fs.readFile(p, (err, fileContents) => {
      if (err || fileContents.length === 0) return;

      let updatedCart;
      try {
        updatedCart = JSON.parse(fileContents);
      } catch (e) {
        console.error("Error parsing cart.json:", e);
        return;
      }

      if (!Array.isArray(updatedCart.products)) return;

      // Find the product to delete
      const product = updatedCart.products.find((prod) => prod.id === id);
      if (!product) return; // Product not in cart, nothing to do

      const qty = product.qty;

      // Remove product from the array
      updatedCart.products = updatedCart.products.filter(
        (prod) => prod.id !== id
      );

      // Update total price
      updatedCart.totalprice -= product.price * qty;

      // Write updated cart back to file
      fs.writeFile(p, JSON.stringify(updatedCart), (err) => {
        if (err) console.error("Error writing cart.json:", err);
      });
    });
  }

  static getcart(cb) {
    fs.readFile(p, (err, fileContents) => {
      const cart = JSON.parse(fileContents);
      if (err) {
        cb(null, []);
      } else {
        cb(cart);
      }
    });
  }

  static removeProduct(id, productPrice, cb) {
    fs.readFile(p, (err, fileContents) => {
        if (err || fileContents.length === 0) return cb();

        let cart = JSON.parse(fileContents);

        if (!cart.products) return cb();

        const existingProductIndex = cart.products.findIndex(prod => prod.id === id);
        if (existingProductIndex === -1) return cb();

        const existingProduct = cart.products[existingProductIndex];

        if (existingProduct.qty > 1) {
            // Decrease quantity by 1
            existingProduct.qty -= 1;
            cart.products[existingProductIndex] = existingProduct;
            cart.totalprice -= productPrice;
        } else {
            // Remove product completely
            cart.totalprice -= productPrice;
            cart.products = cart.products.filter(prod => prod.id !== id);
        }

        fs.writeFile(p, JSON.stringify(cart), err => {
            if (err) console.error("Error writing cart.json:", err);
            cb();
        });
    });
}

};
