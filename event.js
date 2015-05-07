var config = require('./config.json');

exports.startSocket = function(server){

    var io = require('socket.io')(server);
    
    io.on('connection', function(socket){
        //setup session when register event fire
        
        socket.on("register",function(){
            var playerID = playerInfo.add(socket.id);
            console.log('new player connected, socket id:'+ socket.id+', sess id:'+ playerID);
            socket.emit(playerID);
            //A client has dc
            
            socket.on('disconnect', function(){
                playerInfo.clr(socket.id);
		        console.log('user disconnected, socket id:'+ socket.id+', sess id:'+ playerID);
            });
      
            socket.on('sync', function(data){
                socket.broadcast.emit("sync",data);
            });
      
            socket.on('ctrl', function(data) {
                socket.broadcast.emit("ctrl",data);
            });
            
            
            socket.on('gg', function () {
                playerInfo.end();
            });
            
        });
    });
};




var playerInfo = function(){
    var clients =[],
        playerID = 0;
        
    
    return {
      
        add: function (socket_id) {
            if (clients.length >= config.max_player_num) {
                return 0;
            } else {
                playerID += 1;
                clients.push({player: playerID, socket: socket_id});
                return playerID;
            }
        },
        
        get: function (socket_id) {
            for (var i=0; i<clients.length; i++) {
                if (clients[i].socket === socket_id) {
                    return clients[i].player;
                }
            }
        },
        
        clr: function (socket_id) {
            if (playerID === 0) {
                return;
            }
            
            for (var i=0; i<clients.length; i++) {
                if (clients[i].socket === socket_id) {
                   clients.splice(i,1);
                   break;
                }
            }
            
            console.log('clr: ' + JSON.stringify(clients));
        },
        
        end: function () {
            clients = [];
            playerID = 0;
        }
    };
    
}();