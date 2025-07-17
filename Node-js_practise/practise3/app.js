const express = require('express')
const parser=require('body-parser')
const path=require('path')


const admindata=require('./routes/admin')
const shoproutes=require('./routes/shop')
const rootdir=require('./util/path')

const app = express();

app.set('view engine','ejs')  
app.set('views','views')   // if you didnt name your html folder views you have to declare this here with what you named it
app.use(parser.urlencoded({extended: false}))
app.use(express.static(path.join(__dirname,'public')))  //for linking stylesheet

app.use(admindata.routes)

app.use(shoproutes)

app.use((req,res,next)=>{
    res.status(404).render('404',{pageTitle:'Page Not Found'})
})

app.listen(3000)






