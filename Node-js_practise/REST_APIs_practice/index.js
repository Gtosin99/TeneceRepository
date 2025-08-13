const express = require('express');
const bodyparser = require('body-parser')
 
const feedroutes = require('./routes/feed')

const app = express();

app.use(bodyparser.json())

app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin','*')
    res.setHeader('Access-Control-Allow-Methods','GET,POST,PUT,PATCH,DELETE')
    res.setHeader('Access-Control-Allow-Headers','Content-Type,Authorization')
    next()
})

app.use('/feed',feedroutes)

app.listen(8080)