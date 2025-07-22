//This is the controller section which handles all the database logic

const fs = require("fs");
const path = require("path");
const Cart = require('./cart')

const p = path.join(
  path.dirname(process.mainModule.filename),
  "data",
  "products.json"
);

const getProductsFromFile = (cb) => {
  fs.readFile(p, (err, data) => {
    if (err) {
      cb([]);
    } else {
      try {
        const fileData = data.toString().trim();
        cb(fileData ? JSON.parse(fileData) : []); // Handle empty file
      } catch (parseError) {
        cb([]); // In case of invalid JSON
      }
    }
  });
};

module.exports = class Product {
  constructor(id, title, imageURL, description, price) {
    this.title = title;
    this.imageURL = imageURL;
    this.description = description;
    this.price = price;
    this.id = id; //made when editing the data
  }

  save(cb) {
    fs.readFile(p, (err, data) => {
      let products = [];
      if (!err) {
        products = JSON.parse(data);
      }
      if (this.id) {
        const existingproductindex = products.findIndex(
          (prod) => prod.id === this.id
        );
        const updatedproducts = [...products];
        updatedproducts[existingproductindex] = this;
        fs.writeFile(p, JSON.stringify(updatedproducts), (err) => {
          if (cb) cb(); // callback after saving
        });
      } else {
        this.id = Math.random().toString();
        products.push(this);
        fs.writeFile(p, JSON.stringify(products), (err) => {
          if (cb) cb(); // callback after saving
        });
      }
    });
  }

static delete(id, cb) {
  getProductsFromFile(products => {
    const product = products.find(prod => prod.id === id);
    const updatedProducts = products.filter(prod => prod.id !== id);

    fs.writeFile(p, JSON.stringify(updatedProducts), err => {
      if (!err) {
        if (product) {
          Cart.delete(id, product.price); // Only delete from cart if product exists
        }
        cb();
      } else {
        console.error("Error writing updated products:", err);
        cb();
      }
    });
  });
}


  static fetchAll(cb) {
    getProductsFromFile(cb);
  }

  static findById(id, cb) {
    getProductsFromFile((products) => {
      const product = products.find((p) => p.id.toString() === id.toString());
      cb(product);
    });
  }
};
