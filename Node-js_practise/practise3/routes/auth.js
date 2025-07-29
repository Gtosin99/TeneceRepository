const express=require('express')
const router=express.Router()
const authcontroller=require('../controllers/auth')

router.get('/login',authcontroller.getlogin)
router.post('/login',authcontroller.postlogin)
router.post('/logout',authcontroller.postlogout)


module.exports=router