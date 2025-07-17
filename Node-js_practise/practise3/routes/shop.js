const express=require('express')
const path=require('path')
const router=express.Router()

const admindata=require('./admin')

router.get('/',(req,res,next)=>{
    const products = admindata.products
    res.render('shop.pug',{prods:products,docTitle:'Shop'})  //function from express that uses default templating engine listed in app.js
                    //also used to pass content into the template
})

module.exports=router