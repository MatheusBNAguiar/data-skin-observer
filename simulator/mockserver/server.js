var fs = require("fs");
var port = 1337;
var express = require("express");

var server = express();

server.get("/", function(request, response){
    response.sendFile(__dirname + "/index.html");
});

function init(){
    server = server.listen(port);
};

function stop(){
    server.close();
}

// if arg 'start' is passed, server starts. 
// if not, it can be started just programatically, calling init()
if(process.argv.indexOf('start') != -1){
    init();
    console.log("Server listening on port: ", port);
}

module.exports = {
    init,
    stop
};