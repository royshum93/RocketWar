/*global io*/

window.socket = io.connect();
var socket = window.socket;
var playerid;

var oldOnload = window.onload || function () {};
window.onload = function (){
    
    oldOnload();
    socket.emit("register");
    
    //register info of own player (Will not receive other player register event)
    socket.on("register", function (id){
        playerid = id;
    });
    
    //position info from other players
    socket.on("sync", function (data){
        
    });
    
    //other control info, jump, collisions
    socket.on("ctrl", function (data){
        
    });
    
    //end game signal
    socket.on("gg", function (){
        gameStatus = 'ended';
    });
    
    //game info signal
    socket.on('info', function(data){
        
        if (data.action === 'start') {
            gameSignal = 'start';
        }else if (data.action === 'score'){
            //add otherplayer score
            score2 = data.data;
        }
        
    });
};