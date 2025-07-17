const express = require('express')
const parser=require('body-parser')
const path=require('path')

const adminroutes=require('./routes/admin')
const shoproutes=require('./routes/shop')
const rootdir=require('./util/path')

const app = express();

app.use(parser.urlencoded({extended: false}))
app.use(express.static(path.join(__dirname,'public')))  //for linking stylesheet

app.use(adminroutes)

app.use(shoproutes)

app.use((req,res,next)=>{
    res.status(404).sendFile(path.join(rootdir,'views','404.html'))
})

app.listen(3000)






