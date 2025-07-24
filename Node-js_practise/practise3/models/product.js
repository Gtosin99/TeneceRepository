const Sql = require("sequelize");

const sql = require("../util/database");

const Product = sql.define("product", {
  id: {
    type: Sql.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  title: {
    type: Sql.STRING,
    allowNull: false,
    validate: {
      notNull: true,
    },
  },
  price: {
    type: Sql.DECIMAL(10, 2),
    allowNull: false,
  },

  description: {
    type: Sql.STRING,
    allowNull: false,
  },
  imageUrl: {
    type: Sql.STRING,
    allowNull: false,
  }
});

module.exports = Product;
