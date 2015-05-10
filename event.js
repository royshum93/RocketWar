var config = require('./config.json');

exports.startSocket = function(server){

    var io = require('socket.io')(server);
    
    io.on('connection', function(socket){
        //setup session when register event fire
        
        socket.on("register",function(){
            var playerID = playerInfo.add(socket.id);
            console.log('new player connected, player id:'+ playerID);
            socket.emit("register", playerID);
            if (playerInfo.start()){
                console.log('start game');
                io.sockets.emit('info', { action : 'start'});
            }
            
            //A client has dc, gg
            socket.on('disconnect', function(){
                if (playerInfo.start()){
                    io.sockets.emit('gg');
                    playerInfo.end();
                }else {
                    playerInfo.clr(socket.id);
                }
		        console.log('user disconnected, player id:'+ playerID + 'count ' + playerInfo.count());
            });
      
            //relay only, position info from other players
            socket.on('sync', function(data){
                socket.broadcast.emit("sync",data);
            });
      
            //relay only, position info from other players
            socket.on('ctrl', function(data) {
                socket.broadcast.emit("ctrl",data);
            });
            
            //save score, game status for individual players, will not broadcast till endgame
            socket.on('info', function(data){
                playerInfo.putInfo(socket.id, data);
                socket.broadcast.emit('info', data);
            });
            
            socket.on('gg', function () {
                socket.broadcast.emit("gg", playerInfo.get());
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
                clients.push({player: playerID, socket: socket_id, info: {}});
                return playerID;
            }
        },
        
        get: function () {
            return clients;
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
        },
        
        putInfo: function (socket_id, data) {
            for (var i=0; i<clients.length; i++) {
                if (clients[i].socket === socket_id) {
                    clients[i].info = data;
                }
            }
        },
        
        end: function () {
            clients = [];
            playerID = 0;
        },
        
        start: function () {
            return (clients.length === config.max_player_num);
        },
        
        count: function (){
            return clients.length;
        }
    };
    
}();