const express=require('express')
const router=express.Router()
const authcontroller=require('../controllers/auth')

router.get('/login',authcontroller.getlogin)
router.get('/signup', authcontroller.getSignup);
router.post('/login',authcontroller.postlogin)
router.post('/signup', authcontroller.postSignup);
router.post('/logout',authcontroller.postlogout)


module.exports=router