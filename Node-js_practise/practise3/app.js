const express = require('express');
const parser = require('body-parser');
const path = require('path');

const adminroutes = require('./routes/admin');
const shoproutes = require('./routes/shop');
const errors = require('./controllers/errors');
const mongoconnect=require('./util/database').mongoconnect
const User = require('./models/user')


const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(parser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req,res,next)=>{
  User.findById('688508bc0e6683a5353329b7')
  .then(user=>{
    req.user = new User(user.name,user.email,user.cart,user._id)
    next()
  })
  .catch(err=>console.log(err))
})

app.use('/admin', adminroutes.routes);
app.use(shoproutes);
app.use(errors.error404); 

mongoconnect(()=>{
  app.listen(3000)
})

