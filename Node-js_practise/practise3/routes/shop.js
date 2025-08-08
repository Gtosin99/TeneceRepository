const express=require('express')
const path=require('path')
const router=express.Router()
const shopcontroller=require('../controllers/shop')
const isAuth = require('../middleware/is-auth')

const admindata=require('./admin')

router.get('/',shopcontroller.getIndex)
router.get('/products',shopcontroller.getProducts)
router.get('/products/:productId',shopcontroller.getProduct)
router.get('/cart',isAuth,shopcontroller.getCart)
router.get('/orders',isAuth,shopcontroller.getOrders)
router.post('/cart',isAuth,shopcontroller.postCart)
router.post('/cart-delete-item',isAuth,shopcontroller.postCartDeleteItem)
router.get('/orders/:orderId',isAuth,shopcontroller.getInvoice)
router.get('/checkout',isAuth,shopcontroller.getcheckout)
router.get('/checkout/cancel',shopcontroller.getcheckout)
router.get('/checkout/success',isAuth,shopcontroller.postOrder)

module.exports=router