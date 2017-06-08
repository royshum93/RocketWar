var config = require('./../../config.json');

exports.startSocket = function(server){

    var io = require('socket.io')(server);
    
    io.on('connection', function(socket){
        //setup session when register event fire
        
        socket.on("register",function(){
            var playerID = playerInfo.add(socket.id);
            console.log('new player connected, player id:'+ playerID);
            socket.emit("register", playerID);
            
            
            //start
            if (playerInfo.start()){
                var start_data = {},
                    clientList = playerInfo.get(),
                    i;
                    
                start_data.action = 'start';
                start_data.coord = [];
                
                for(i = 0 ; i < clientList.length; i += 1) {
                    var playerCoord = {};
                    playerCoord.id = i+1;
                    playerCoord.startX = Math.floor((Math.random() * 846) + 12);
                    start_data.coord.push(playerCoord);
                }
                
                io.sockets.emit('info', start_data);
                console.log('start game, ' + JSON.stringify(start_data));
            }
            
            
            
            //A client has dc, gg
            socket.on('disconnect', function(){
                if (playerInfo.isStart() && playerInfo.exist(socket.id)){
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
                socket.broadcast.emit('info', data);
                console.log('info :' + JSON.stringify(data));
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
        playerID = 0,
        started = false;
        
    
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
            
            playerID--;
        },
        
        exist: function (socket_id) {
            for (var i=0; i<clients.length; i++) {
                if (clients[i].socket === socket_id) {
                    return true;
                }
            }
            return false;
        },
        
        end: function () {
            clients = [];
            playerID = 0;
            started = false;
        },
        
        start: function () {
            if ((!started) && (clients.length === config.max_player_num)){
                started = true;
                return true;
            }
                return false;
        },
        
        count: function (){
            return clients.length;
        },
        
        isStart: function(){
            return started;
        }
    };
    
}();