const express=require('express')
const router=express.Router()
const path=require('path')
const admincontroller=require('../controllers/admin')
const isAuth = require('../middleware/is-auth')


router.get('/add-product',isAuth,admincontroller.getAddProduct)  //the request will be funneled from left to right

router.post('/add-product',isAuth,admincontroller.postAddProduct)

router.get('/products',isAuth,admincontroller.getProducts)

router.get('/edit-product/:productId',isAuth,admincontroller.getEditProduct)

router.post('/edit-product',isAuth,admincontroller.postEditProduct)

router.post('/delete-product',isAuth,admincontroller.postDeleteProducts)

exports.routes= router
