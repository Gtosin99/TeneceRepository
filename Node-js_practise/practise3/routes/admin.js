const express=require('express')
const router=express.Router()
const path=require('path')

router.get('/add-product',(req,res,next)=>{
    res.sendFile(path.join(__dirname,'../','views','add-product.html'))
})

router.post('/product',(req,res,next)=>{   //can use the same path name but as long as the method (get,post) is different
    console.log(req.body)
    res.redirect('/')
})

module.exports=router