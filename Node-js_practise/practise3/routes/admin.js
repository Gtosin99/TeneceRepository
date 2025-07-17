const express=require('express')
const router=express.Router()
const path=require('path')

const product=[];

router.get('/add-product',(req,res,next)=>{
    res.render('add-product',{pageTitle:'Add Product'})
})

router.post('/add-product',(req,res,next)=>{   //can use the same path name but as long as the method (get,post) is different
    product.push({title:req.body.title})
    res.redirect('/')
})

exports.routes= router;
exports.products=product;