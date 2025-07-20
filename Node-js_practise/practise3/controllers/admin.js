const Products=require('../models/product')

exports.getProducts=(req,res,next)=>{
    Products.fetchAll(products=>{
        res.render('admin/products',{prods:products,pageTitle:'Admin List',path:'/admin/products',name:' '})  //function from express that uses default templating engine listed in app.js
                    //also used to pass content into the template
    })
}

exports.postAddProduct=(req,res,next)=>{   //can use the same path name but as long as the method (get,post) is different
    const title=req.body.title
    const imageUrl=req.body.imageURL    //these are the values from the form the name must match what is written in your form
    const price=req.body.price
    const description=req.body.description
    const product= new Products(title,imageUrl,description,price)
    product.save()
    res.redirect('/')
}

exports.getAddProduct = (req,res,next)=>{
    res.render('admin/add-product',{pageTitle:'Add Product',path:'/admin/add-product'})
}