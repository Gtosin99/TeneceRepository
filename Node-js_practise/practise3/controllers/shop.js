const Products=require('../models/product')
const Cart=require('../models/cart')
const Product = require('../models/product')


exports.getProducts=(req,res,next)=>{
    Products.fetchAll(products=>{
        res.render('shop/product-list',{prods:products,pageTitle:'All Products',path:'/products',name:'shop'})  //function from express that uses default templating engine listed in app.js
                    //also used to pass content into the template
    })
}

exports.getProduct=(req,res,next)=>{
    const prodId=req.params.productId;  //to extract product id from the path
    Products.findById(prodId,product =>{
       res.render('shop/product-details',{
        prods:product,
        pageTitle:product.title,
        path:'/products'}) 
    })
}

exports.getIndex = (req,res,next)=>{
    Products.fetchAll(products=>{
        res.render('shop/product-list',{prods:products,pageTitle:'Shop',path:'/',name:'shop'})  //function from express that uses default templating engine listed in app.js
                    //also used to pass content into the template
})
}

exports.getCart = (req,res,next)=>{
    Cart.getcart(cart=>{
        Product.fetchAll(products=>{
            const cartProducts = []
            for(let prod of products){
                const cartProduct = cart.products.find(prodId => prodId.id === prod.id)
                if(cartProduct){
                    cartProducts.push({product:prod,quantity:cartProduct.qty})
                        }
                    }
                    res.render('shop/cart',{
                            cart:cartProducts,
                            pageTitle:'Your Cart',
                            path:'/cart',
                            products:cartProducts})
        })

    })
    
}

exports.postCart = (req,res,next) =>{
    const prodId=req.body.productId;
    console.log('Product ID from form:', req.body.productId);
    //const quantity = req.body.quantity;
    Products.findById(prodId,product=>{
        Cart.addProduct(prodId,product.price,()=>{
            res.redirect('/cart')
        })
    })
}

exports.getCheckout = (req,res,next)=>{
    res.render('shop/checkout',{path:'/checkout',pageTitle:'Checkout'})

}

exports.getOrders = (req,res,next)=>{
    res.render('shop/orders',{path:'/orders',pageTitle:'Orders'})

}

exports.postCartDeleteItem=(req,res,next)=>{
    const prodId=req.body.productId;
    Product.findById(prodId,product=>{
        Cart.removeProduct(prodId,product.price,()=>{
            res.redirect('/cart')
        })
    })
}


