/*global io*/

window.socket = io.connect();
var socket = window.socket;

var oldOnload = window.onload || function () {};
window.onload = function (){
    
    oldOnload();
    socket.emit("register");
    
    //register info of own player (Will not receive other player register event)
    socket.on("register", function (id){
        
    });
    
    //position info from other players
    socket.on("sync", function (data){
        
    });
    
    //other control info, jump, collisions
    socket.on("ctrl", function (data){
        
    });
    
    //end game signal, display scoreboard
    socket.on("gg", function (data){
        
    });
};