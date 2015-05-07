#!/bin/env node
//dependencies
var express = require('express');
var app = express();
var path = require('path');
var event = require("./event.js");


module.exports = app;
//serve static content over /session
app.use('/',express.static(__dirname + '/public'));



//Routing
app.get('/', function (req, res) {
   res.sendfile(path.join(__dirname + '/public/test.html'));
});


//Listening
var server_port = process.env.PORT || 80;
var server_ip_address = process.env.IP || '127.0.0.1';
var server = app.listen(server_port, server_ip_address);


//call socket.io listen
event.startSocket(server);


