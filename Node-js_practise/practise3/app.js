const express = require('express')
const parser=require('body-parser')
const path=require('path')


const adminroutes=require('./routes/admin')
const shoproutes=require('./routes/shop')
const errors=require('./controllers/errors')
const db = require('./util/database')

const app = express();

app.set('view engine','ejs')  
app.set('views','views')   // if you didnt name your html folder views you have to declare this here with what you named it

app.use(parser.urlencoded({extended: false}))
app.use(express.static(path.join(__dirname,'public')))  //for linking stylesheet

app.use('/admin',adminroutes.routes)

app.use(shoproutes)

app.use(errors.error404)

app.listen(3000)






