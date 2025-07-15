const http = require("http"); //import http module
const route = require('./route')


const server = http.createServer(route); //create server and runs function rqlistener

server.listen(3000);
