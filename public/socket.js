/*global io*/

var socket = io.connect();

var oldOnload = window.onload || function () {};
window.onload = function (){
    
    oldOnload();
    socket.emit("register", function (id){
        
        alert('player id = ' + id);
        
    });
};