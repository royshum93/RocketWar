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
		if (otherPlayer !== undefined) {
			otherPlayer.reset(data.x, data.y);
		}
    });
    
    //other control info, jump, collisions
    socket.on("ctrl", function (data){
        if (data.action === "move") {
            move(otherPlayer, data.data);
        } else if (data.action === "fire") {
            p2Weapons[data.data.W].fire(otherPlayer,data.data.LR,data.data.Dir,data.data.faceD);
        }
    });
    
    
    
    //end game signal
    socket.on("gg", function (){
        gameStatus = 'ended';
    });
    
    
    //game info signal
    socket.on('info', function(data){
        if (data.action === 'start') {
            gameSignal = 'start';
            
            for (var i = 0; i < data.coord.length; i += 1){
                
                
                if (data.coord[i].id == playerid) {
                    setTimeout(function() {
                        var setCoord = data.coord[i].startX;
                        return function(){ p1Reborn(setCoord) };
                    }(), 100);
                } else {
                    setTimeout(function() {
                        var setCoord = data.coord[i].startX;
                        return function(){ p2Reborn(setCoord) };
                    }(), 100);
                }
            }
        }else if (data.action === 'score'){
            //add otherplayer score
            score2 = data.data;
            scoreText2.text = "Other\'s Score: " + score2;
        }
        
    });
};