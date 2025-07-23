//This is the controller section which handles all the database logic

const Cart = require('./cart')
const db=require('../util/database')



module.exports = class Product {
  constructor(id, title, imageURL, description, price) {
    this.title = title;
    this.imageURL = imageURL;
    this.description = description;
    this.price = price;
    this.id = id; //made when editing the data
  }

  save() {
    return db.execute('INSERT INTO products(title,price,imageURL,description) VALUES(?,?,?,?)', //the ? are to prevent sql injection attacks
      [this.title, this.price, this.imageURL, this.description]
    )
  }


static delete(id) {
 
}


  static fetchAll() {
   return db.execute('SELECT * FROM products')

   
  }

  static findById(id) {
     return db.execute('SELECT * FROM products WHERE id=?', [id])
}
}
