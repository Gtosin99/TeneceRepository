const express = require('express');
const parser = require('body-parser');
const path = require('path');

const adminroutes = require('./routes/admin');
const shoproutes = require('./routes/shop');
const errors = require('./controllers/errors');
const sql = require('./util/database');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(parser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Attach user to request
app.use((req, res, next) => {
  User.findByPk(1)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use('/admin', adminroutes.routes);
app.use(shoproutes);
app.use(errors.error404);

// Associations
Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);

User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });

Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });

// Sync Database
sql
  .sync() // DON'T use this in production
  .then(() => User.findByPk(1))
  .then(user => {
    if (!user) {
      return User.create({ name: 'Tosin', email: 'tosinakindele826@gmail.com' });
    }
    return user;
  })
  .then(user => user.createCart())
  .then(() => {
    app.listen(3000, () => console.log('Server running on port 3000'));
  })
  .catch(err => console.log(err));
