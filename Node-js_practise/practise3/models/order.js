const Sql=require('sequelize')
const sql=require('../util/database')

const Order = sql.define('order', {
  id: {
    type: Sql.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull:false
    }
  })

  module.exports = Order
