const getdb = require('../util/database').getDb
const mongodb=require('mongodb')
class Product{
  constructor(title,price,description,imageUrl,id,userId){
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    this._id = id ? new mongodb.ObjectId(id) : null;
    this.userId=userId
  }


 save() {
  const db = getdb()
  if (this._id) {
      return db.collection('products')
        .updateOne({ _id: this._id }, { $set: this });
    }else{
  return db.collection('products')
  .insertOne(this)
  .then(result => {
    return result
    })
  .catch(err => console.log(err))
 }


}

 static fetchall(){
  const db = getdb()
   return db.collection('products')  //used to specify the collection to connect to
    .find().toArray() 
    .then((products=>{
      return products;
    }))
    .catch(err=>console.log(err))
  }

  static findbyId(prodId){
    const db = getdb()
    return db.collection('products')
      .findOne({_id: new mongodb.ObjectId(prodId)}) //find one product by id
      .then(product => {
      return product;
      })
      .catch(err => console.log(err))
  }

  static deletebyId(prodId){
    const db = getdb()
    return db.collection('products')
    .deleteOne({_id: new mongodb.ObjectId(prodId)}) //delete one product by id
    .then(result => {
      return result 
    })
    .catch(err=>console.log(err))

  }


}
module.exports = Product;
