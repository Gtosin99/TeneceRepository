const express=require('express')
const router=express.Router()
const path=require('path')
const admincontroller=require('../controllers/admin')


const product=[];

router.get('/add-product',admincontroller.getAddProduct)

router.post('/add-product',admincontroller.postAddProduct)

router.get('/products',admincontroller.getProducts)

exports.routes= router
