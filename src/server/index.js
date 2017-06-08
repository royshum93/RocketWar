#!/bin/env node
//dependencies
var express = require('express');
var app = express();
var path = require('path');
var event = require("./event.js");
var config = require('./../../config.json');

module.exports = app;
//serve static content over /session
app.use('/',express.static(__dirname + '/../public'));
app.use('/lib/socket.io',express.static(__dirname + '/../../node_modules/socket.io-client/dist'));
app.use('/lib/phaser',express.static(__dirname + '/../../node_modules/phaser/dist'));



//Routing
app.get('/', function (req, res) {
   res.sendfile(path.join(__dirname + '/../public/index.html'));
});


//Listening
var server_port = config.PORT || process.env.PORT || 80;
var server = app.listen(server_port);


//call socket.io listen
event.startSocket(server);


