const Sql=require('sequelize')
const sql=require('../util/database')

const Cart = sql.define('cart', {
  id: {
    type: Sql.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull:false
    }
  })

  module.exports = Cart
