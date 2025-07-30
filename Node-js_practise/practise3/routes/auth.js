const express=require('express')
const router=express.Router()
const authcontroller=require('../controllers/auth')

router.get('/login',authcontroller.getlogin)
router.get('/signup', authcontroller.getSignup);
router.post('/login',authcontroller.postlogin)
router.post('/signup', authcontroller.postSignup);
router.post('/logout',authcontroller.postlogout)
router.get('/reset',authcontroller.getReset)
router.post('/reset',authcontroller.postReset)
router.get('/new-password/:token',authcontroller.getnewpassword)
router.post('/new-password',authcontroller.postnewpassword)


module.exports=router