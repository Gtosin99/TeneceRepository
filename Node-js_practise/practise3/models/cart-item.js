const Sql=require('sequelize')
const sql=require('../util/database')

const CartItem = sql.define('cartitem', {
    id: {
    type: Sql.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull:false
    },
    quantity:Sql.INTEGER
  })

  module.exports = CartItem
