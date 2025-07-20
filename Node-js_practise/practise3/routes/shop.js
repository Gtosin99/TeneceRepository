const express=require('express')
const path=require('path')
const router=express.Router()
const shopcontroller=require('../controllers/shop')

const admindata=require('./admin')

router.get('/',shopcontroller.getIndex)
router.get('/products',shopcontroller.getProducts)
router.get('/cart',shopcontroller.getCart)
router.get('/checkout',shopcontroller.getCheckout)
router.get('/orders',shopcontroller.getOrders)

module.exports=router