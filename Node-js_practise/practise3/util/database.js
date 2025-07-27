const { MongoClient } = require('mongodb');


let db;
const mongoconnect=(callback)=>{
    MongoClient.connect('mongodb+srv://tosinakindele826:12345@cluster0.otcx1mi.mongodb.net/shop?retryWrites=true&w=majority&tls=true')
    .then((result)=>{
        console.log('connected')
        db=result.db()
        callback()
    })
    .catch(err=>{
        console.log(err)
        throw err
    })
}

const getDb = () => {
    if (!db) {
        throw 'No Database Found'
        }
        return db
    }

exports.mongoconnect    = mongoconnect
exports.getDb = getDb
