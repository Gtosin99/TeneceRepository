const Sql = require('sequelize')

const sql = new Sql('node-complete','root','tony1970',{
    dialect:'mysql',
    host:'localhost'
})

module.exports=sql