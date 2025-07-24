const Sql = require("sequelize");
const sql = require("../util/database");

const User = sql.define("users", {
  id: {
    type: Sql.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: Sql.STRING(50),
    allowNull: false,
  },
  email: {
    type: Sql.STRING(100),
    allowNull: false,
  }
});

module.exports=User

