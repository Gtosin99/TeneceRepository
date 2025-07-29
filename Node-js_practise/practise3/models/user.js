const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    cart:{
        items:[{
            productId:{
                type: Schema.Types.ObjectId,
                ref: 'Product',
                required:true
            },
            quantity:{
                type:Number,
                required:true
            }
        }]
    } 
});
userSchema.methods.addToCart = function(product){
    const cartProductIndex = this.cart.items.findIndex((cp) => {
      return cp.productId.toString() === product._id.toString();
    });
    let newQuantity = 1;
    const updatedcartitems = [...this.cart.items];
    if (cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      updatedcartitems[cartProductIndex].quantity = newQuantity;
    } else {
      updatedcartitems.push({
        productId: product._id,
        quantity: newQuantity,
      });
    }

    const updatedCart = { items: updatedcartitems }
    this.cart = updatedCart;
    return this.save()
  
}

userSchema.methods.delete1 = function(productId){
     const update = this.cart.items.filter((item) => {
      return item.productId.toString() !== productId.toString();
    });
    this.cart.items = update;
    return this.save()
}

userSchema.methods.clearcart = function(){
    this.cart = {items: []};
    return this.save()
}

    
    module.exports = mongoose.model('User',userSchema)


// const getdb = require("../util/database").getDb;
// const mongodb = require("mongodb");

// class User {
//   constructor(username, email, cart, id) {
//     this.username = username;
//     this.email = email;
//     this.cart = cart;
//     this._id = id;
//   }

//   save() {
//     const db = getdb();
//     return db
//       .collection("users")
//       .insertOne(this)
//       .then((result) => {
//         return result;
//       })
//       .catch((err) => console.log(err));
//   }



//   getCart() {
//     const db = getdb();
//     const productIds = this.cart.items.map((item) => item.productId);

//     return db
//       .collection("products")
//       .find({ _id: { $in: productIds } })
//       .toArray()
//       .then((products) => {
//         return products.map((p) => {
//           return {
//             ...p,
//             cartitem: this.cart.items.find(
//               (i) => i.productId.toString() === p._id.toString()
//             ),
//           };
//         });
//       });
//   }

//   delete(productId) {
//     const update = this.cart.items.filter((item) => {
//       return item.productId.toString() !== productId.toString();
//     });
//     const db = getdb();
//     return db
//       .collection("users")
//       .updateOne(
//         { _id: new mongodb.ObjectId(this._id) },
//         { $set: { cart: { items: update } } }
//       )
//       .then(() => {
//         this.cart.items = update; // keep in-memory object in sync
//       });
//   }

//   static findById(userid) {
//     const db = getdb();
//     return db
//       .collection("users")
//       .findOne({ _id: new mongodb.ObjectId(userid) })
//       .then((user) => {
//         return user;
//       })
//       .catch((err) => console.log(err));
//   }

//   addOrder() {
//   const db = getdb();
//   return this.getCart()
//     .then(products => {
//       const order = {
//         items: products,
//         user: {
//           _id: new mongodb.ObjectId(this._id),
//           username: this.username
//         }
//       };
//       return db.collection("orders").insertOne(order);
//     })
//     .then(result => {
//       this.cart = { items: [] }; // ✅ Reset cart as empty array
//       return db.collection("users")
//         .updateOne(
//           { _id: new mongodb.ObjectId(this._id) },
//           { $set: { cart: { items: [] } } } // ✅ Match correct structure
//         );
//     });
// }

//   getOrders(){
//     const db = getdb();
//     return db.collection("orders")
//       .find({'user._id':new mongodb.ObjectId(this._id)})
//       .toArray().then((orders) => {
//       return orders;
//   })}

// }
// module.exports = User;
