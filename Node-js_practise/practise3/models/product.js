//This is the controller section which handles all the database logic

const fs = require("fs");
const path = require("path");


module.exports = class Product {
  constructor(title,imageURL,description,price) {
    this.title = title;
    this.imageURL = imageURL;
    this.description = description;
    this.price = price;
  }

  save() {
    const p = path.join(
      path.dirname(process.mainModule.filename),
      "data",
      "products.json"
    );
    fs.readFile(p, (err, data) => {
      let products=[]
      if (!err) {     // an error will be sent if the file cannot be found
        products=JSON.parse(data)  //this will put the contents of the json file into an array
      }
      products.push(this)
      fs.writeFile(p,JSON.stringify(products),(err)=>{
        console.log(err)
      }) //
    });
  }

  static fetchAll(cb) {
    const p = path.join(
      path.dirname(process.mainModule.filename),
      "data",
      "products.json"
    );
    fs.readFile(p,(err,data)=>{
        if (err){
            cb([])
        }else{
               try {
                const fileData = data.toString().trim();
                cb(fileData ? JSON.parse(fileData) : []); // Handle empty file
            } catch (parseError) {
                cb([]); // In case of invalid JSON
            }}
        
    })
  }
};
