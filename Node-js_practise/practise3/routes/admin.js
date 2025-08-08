const express=require('express')
const router=express.Router()
const {body}=require('express-validator')
const admincontroller=require('../controllers/admin')
const isAuth = require('../middleware/is-auth')


router.get('/add-product',isAuth,admincontroller.getAddProduct)  //the request will be funneled from left to right

router.post('/add-product',isAuth,[
    body('title')
      .isString()
      .isLength({ min: 3 }).withMessage('Title must be at least 3 characters long')
      .trim(),
    body('price').isFloat().withMessage('Invalid price').not().isEmpty().withMessage('Price must not be empty'),
    body('description')
      .isLength({ min: 5, max: 400 }).withMessage('Invalid Description')
      .trim()
  ],admincontroller.postAddProduct)

router.get('/products',isAuth,admincontroller.getProducts)

router.get('/edit-product/:productId',isAuth,admincontroller.getEditProduct)

router.post('/edit-product',isAuth,[
    body('title')
      .isString()
      .isLength({ min: 3 }).withMessage('Title must be at least 3 characters long')
      .trim(),
    body('imageURL').isURL().withMessage('Invalid URL'),
    body('price').isFloat().withMessage('Invalid price').not().isEmpty().withMessage('Price must not be empty'),
    body('description')
      .isLength({ min: 5, max: 400 }).withMessage('Invalid Description')
      .trim()
  ],admincontroller.postEditProduct)

router.delete('/product/:productId',isAuth,admincontroller.DeleteProducts)

exports.routes= router
