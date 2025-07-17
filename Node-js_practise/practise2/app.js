const express = require('express')


const app = express()

app.use('/',(req,res,next)=>{
   console.log("Hello")
    next()
})

app.use('/message',(req,res,next)=>{
    res.send('<h1 style = "background-color:red">Hello From Express to Tosin </h1>')
    console.log("Hello2")
})


app.listen(3000)