const Products=require('../models/product')


exports.getProducts=(req,res,next)=>{
    Products.fetchAll(products=>{
        res.render('shop/product-list',{prods:products,pageTitle:'All Products',path:'/products',name:'shop'})  //function from express that uses default templating engine listed in app.js
                    //also used to pass content into the template
    })
}

exports.getIndex = (req,res,next)=>{
    Products.fetchAll(products=>{
        res.render('shop/product-list',{prods:products,pageTitle:'Shop',path:'/',name:'shop'})  //function from express that uses default templating engine listed in app.js
                    //also used to pass content into the template
})
}

exports.getCart = (req,res,next)=>{
    res.render('shop/cart',{path:'/cart',pageTitle:'Your Cart'})

}

exports.getCheckout = (req,res,next)=>{
    res.render('shop/checkout',{path:'/checkout',pageTitle:'Checkout'})

}

exports.getOrders = (req,res,next)=>{
    res.render('shop/orders',{path:'/orders',pageTitle:'Orders'})

}


