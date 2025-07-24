const Sql=require('sequelize')
const sql=require('../util/database')

const OrderItem = sql.define('orderitem', {
    id: {
    type: Sql.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull:false
    },
    quantity:Sql.INTEGER
  })

  module.exports = OrderItem
