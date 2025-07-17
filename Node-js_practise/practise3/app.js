const express = require('express')
const parser=require('body-parser')
const path=require('path')

const admindata=require('./routes/admin')
const shoproutes=require('./routes/shop')
const rootdir=require('./util/path')

const app = express();

app.set('view engine','pug')  // app.set() allows to set and get global values of app 
                              //but that isnt the use here we are using it to define the templating engine
app.set('views','views')   // if you didnt name your html folder views you have to declare this here with what you named it
app.use(parser.urlencoded({extended: false}))
app.use(express.static(path.join(__dirname,'public')))  //for linking stylesheet

app.use(admindata.routes)

app.use(shoproutes)

app.use((req,res,next)=>{
    res.status(404).render('404')
})

app.listen(3000)






