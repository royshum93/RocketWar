
(function () {

   'use strict';
   
   
var game = new Phaser.Game(900, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {
    game.load.image('sky', 'assets/sky.png');
    game.load.image('ground', 'assets/platform.png');
    game.load.image('bullet10', 'assets/bullet10.png');
    game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
    game.load.spritesheet('dude2', 'assets/dude2.png', 32, 48);
    game.load.audio('end', 'assets/end.mp3');
    game.load.audio('fire', 'assets/fire.mp3');
    game.load.audio('jump', 'assets/jump.mp3');
    game.load.audio('start', 'assets/start.mp3');
    game.load.audio('explosion', 'assets/explosion.mp3');
}

var player;
var otherPlayer;

var platforms;
var cursors;
var p1Weapons = [];
var p2Weapons = [];
var p1CurrentWeapon = 0;
var p2CurrentWeapon = 0;

var rocketDirection;
var rocketLRDirection;
var score = 0;
var score2 = 0;
var scoreText;
var scoreText2;

var timer;
var timerText;
var gameSignal = "waiting";
var gameStatus = "waiting";
var gameMessage;

function create() {
    //  We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //  A simple background for our game
    game.add.sprite(0, 0, 'sky');

    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = game.add.group();

    //  We will enable physics for any object that is created in this group
    platforms.enableBody = true;    

    // Here we create the ground.
    var ground = platforms.create(0, game.world.height - 32, 'ground');

    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    ground.scale.setTo(2, 2);

    //  This stops it from falling away when you jump on it
    ground.body.immovable = true;

    //  Now let's create two ledges
    var ledge = platforms.create(750, 400, 'ground');
    ledge.body.immovable = true;

    ledge = platforms.create(-300, 400, 'ground');
    ledge.body.immovable = true;

    // middle one
    var middleLedge = platforms.create(340, 536, 'ground');
    middleLedge.scale.setTo(0.5, 1);
    middleLedge.body.immovable = true;

    // ledges in the air
    var airLedge = platforms.create(220, 250, 'ground');
    airLedge.body.immovable = true;
    var smallLedge = platforms.create(429, 218, 'ground');
    smallLedge.scale.setTo(0.08, 1);
    smallLedge.body.immovable = true;

    // walls
    var leftWall = platforms.create(0, 0, 'ground');
    leftWall.scale.setTo(0.03, 18);
    leftWall.body.immovable = true;

    var rightWall = platforms.create(887, 0, 'ground');
    rightWall.scale.setTo(0.03, 18);
    rightWall.body.immovable = true;

    // upper wall
    var upperWall = platforms.create(0, 0, 'ground');
    upperWall.scale.setTo(2, 0.5);
    upperWall.body.immovable = true;

    // The players and their postiions
    // random horizontal position when reborn
    var p1xPostion = game.rnd.integerInRange(12, 858);
    var p2xPostion = game.rnd.integerInRange(12, 858);

    // add players
    player = game.add.sprite(p1xPostion, game.world.height - 550, 'dude');
    otherPlayer = game.add.sprite(p2xPostion, game.world.height - 550, 'dude2');

    //  We need to enable physics on the player
    game.physics.arcade.enable(player);
    game.physics.arcade.enable(otherPlayer);
    game.physics.arcade.enable(p1Weapons);
    game.physics.arcade.enable(p2Weapons);
    
    player.body.bounce.y = 0;
    player.body.gravity.y = 250;
    otherPlayer.body.bounce.y = 0;
    otherPlayer.body.gravity.y = 250;
    player.body.collideWorldBounds = true;
    otherPlayer.body.collideWorldBounds = true;

    //  Our controls.
    cursors = game.input.keyboard.createCursorKeys();

    // Weapon array
    p1Weapons.push(new Weapon.Rockets(this.game));
    p1Weapons.push(new Weapon.RocketsX3(this.game));
    p2Weapons.push(new Weapon.Rockets(this.game));
    p2Weapons.push(new Weapon.RocketsX3(this.game));

    //  Our two animations, walking left and right.
    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);
    player.faceDirection = "right";

    otherPlayer.animations.add('left', [0, 1, 2, 3], 10, true);
    otherPlayer.animations.add('right', [5, 6, 7, 8], 10, true);
    otherPlayer.faceDirection = "left";

    //  The score
    if (playerid === 0){
        scoreText = game.add.text(32, 32, 'Player 1\'s Score: 0', { fontSize: '18px', fill: '#FFF' });
        scoreText2 = game.add.text(700, 32, "Player 2\'s Score: 0", { fontSize: '18px', fill: '#FFF' }); 
    }else {
        scoreText = game.add.text(32, 32, 'Your Score: 0', { fontSize: '18px', fill: '#FFF' });
        scoreText2 = game.add.text(700, 32, "Other\'s Score: 0", { fontSize: '18px', fill: '#FFF' });
    }
	// timer
    timerText = game.add.text(408, 28, '03:00', { fontSize: '32px', fill: '#FFF', align: 'center'});
    timer = game.time.create();

    gameMessage = game.add.text(264, 245, "", { fontSize: '32px', fill: '#FFF', align: 'center'});
}

function update() {
	// game signals
	if(gameStatus == "waiting" && gameSignal == "start") {
		game.sound.play('start');
		startGame();
	}

	// when game ended and press space
    if(gameStatus == "ended" && this.input.keyboard.isDown(Phaser.Keyboard.ENTER)) {
    	game.sound.play('start');
    	restartGame();
    }

    //  Collide the player and the stars with the platforms
    game.physics.arcade.collide(player, platforms);
    game.physics.arcade.collide(otherPlayer, platforms);
    game.physics.arcade.collide(platforms, p1Weapons);
    game.physics.arcade.collide(platforms, p2Weapons);
    game.physics.arcade.collide(p1Weapons, p2Weapons, weaponColideWeapon);

    //  Checks to see if the player overlaps with any of the rocket
    game.physics.arcade.overlap(otherPlayer, p1Weapons, weaponCollideOtherPlayer, null, this);
    game.physics.arcade.overlap(player, p2Weapons, weaponCollidePlayer, null, this);

    upgradeWeapon();

    //  Reset the players velocity (movement)
    player.body.velocity.x = 0;
    otherPlayer.body.velocity.x = 0;
    
    //sync other player position
    if (player.alive) {
        window.socket.emit("sync", {id: playerid, x: player.x, y: player.y});
    }
    
    if (cursors.left.isDown && gameStatus == "playing" && (playerid !== 0)) {
        //  Move to the left
        move(player, "left");
        window.socket.emit('ctrl', {id: playerid, action: 'move', data: "left" });
    }
    else if (cursors.right.isDown && gameStatus == "playing"  && (playerid !== 0)) {
        // Move to the right
        move(player, "right");
        window.socket.emit('ctrl', {id: playerid, action: 'move', data: "right" });
    }
    else {
        // Stand still
        player.animations.stop();

        if(player.faceDirection == "left")
            player.frame = 0;
        else if(player.faceDirection == "right")
            player.frame = 5;

        rocketLRDirection = "none";
    }

    // control rocket directions
    if(cursors.up.isDown) {
        rocketDirection = "up";
    }
    else if(cursors.down.isDown) {
        rocketDirection = "down";
    }
    else {
        rocketDirection = "none";
    }
    
    //  Allow the player to jump if they are touching the ground.
    if (cursors.up.isDown && player.body.touching.down  && gameStatus == "playing"  && (playerid !== 0)) {
        player.body.velocity.y = -350;
        game.sound.play('jump');
        window.socket.emit('ctrl', {id: playerid, action: 'move', data: "jump" });
    }

    // fire
    if(this.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)  && gameStatus == "playing"  && (playerid !== 0)) {
        if(player.alive) {
        	p1Weapons[p1CurrentWeapon].fire(player,rocketLRDirection,rocketDirection,player.faceDirection);
        	window.socket.emit('ctrl', {id: playerid, action: 'fire', data: {W: p1CurrentWeapon, LR: rocketLRDirection, Dir: rocketDirection, faceD: player.faceDirection} });
        }
    }

   	if (timer.running && gameStatus != "ended") {
        timerText.setText(formatTime(Math.round((timerEvent.delay - timer.ms) / 1000)));
    }
    else {
    	if(gameStatus == "waiting")
    		gameMessage.setText("      Waiting to Start...");
    	else if(gameStatus == "ended") {
    		var winnerMsg;
    		
    		if (playerid !== 0){
    	    	if(score > score2)
    		    	winnerMsg = " You Win!";
    		    else if(score < score2)
        			winnerMsg = "You Lose!";
        		else
    	    		winnerMsg = "Draw Game!";
    		}else{
    		    if(score > score2)
    		    	winnerMsg = "Player 1 Win!";
    		    else if(score < score2)
        			winnerMsg = "Player 2 Win!";
        		else
    	    		winnerMsg = "Draw Game!";
    		}
    		
    		gameMessage.setText(winnerMsg + "\n" + "Press Enter to Restart!");
    	}
    }
}

function startGame() {
	gameMessage.setText("");
    // Create a delayed event 3m from now
    timerEvent = timer.add(Phaser.Timer.MINUTE * 3, endGame, this);        
    // Start the timer
    timer.start();
    gameStatus = "playing";
}

function endGame() {
	timer.stop();
	gameStatus = "ended";
	game.sound.play('end');
	window.socket.emit('gg');
}

function restartGame() {
	// gameMessage.setText("");
	// // reset scores
	// score = 0;
	// score2 = 0;

	// // reset timer
	// timer.destroy();
	// timer = game.time.create();
	// timerEvent = timer.add(Phaser.Timer.MINUTE * 0.1, endGame, this);        
 	// timer.start();

	// gameStatus = "playing";

	location.reload();
}

function move(p, dir) {
	if(dir == "left") {
		if(p === player) {
			if(score >= 15)
				p.body.velocity.x = -450;
			else if(score >= 5)
				p.body.velocity.x = -300;
			else
				p.body.velocity.x = -150;
		}
		else if(p === otherPlayer) {
			if(score2 >= 15)
				p.body.velocity.x = -450;
			else if(score2 >= 5)
				p.body.velocity.x = -300;
			else
				p.body.velocity.x = -150;
		}
		p.animations.play('left');
		p.faceDirection = "left";
	}
	else if(dir == "right") {
		if(p === player) {
			if(score >= 15)
				p.body.velocity.x = 450;
			else if(score >= 5)
				p.body.velocity.x = 300;
			else
				p.body.velocity.x = 150;
		}
		else if(p === otherPlayer) {
			if(score2 >= 15)
				p.body.velocity.x = 450;
			else if(score2 >= 5)
				p.body.velocity.x = 300;
			else
				p.body.velocity.x = 150;
		}
        p.animations.play('right');
        p.faceDirection = "right";
	}else if (dir == "jump") {
	    p.body.velocity.y = -350;
        game.sound.play('jump');
	}
}

function formatTime(s) {
	// Convert seconds (s) to a nicely formatted and padded time string
    var minutes = "0" + Math.floor(s / 60);
    var seconds = "0" + (s - minutes * 60);
    return minutes.substr(-2) + ":" + seconds.substr(-2); 
}

function weaponCollideOtherPlayer (otherPlayer, p1Weapons) {
	game.sound.play('explosion');

    p1Weapons.kill();
    otherPlayer.kill();

    // timer for player to reborn
    var p2RebornTimer = game.time.events.add(Phaser.Timer.SECOND * 1, p2Reborn, this);

    //  Add and update the score

    score += 1;
    scoreText.text = 'Your Score: ' + score;
    window.socket.emit('info', {id: playerid, action: 'score' , data: score});
}

function weaponCollidePlayer (player, p2Weapons) {
	game.sound.play('explosion');
    
    p2Weapons.kill();
    player.kill();

    // timer for player to reborn
    var p1RebornTimer = game.time.events.add(Phaser.Timer.SECOND * 1, p1Reborn, this);

    //  Add and update the score
    // duplication of adding score from socket
    //score2 += 1;
    scoreText2.text = "Other\'s Score: " + score2;
}

function weaponColideWeapon(p1Weapons, p2Weapons) {
    p1Weapons.kill();
    p2Weapons.kill();
}

function p1Reborn(randomXPosition) {
    var randomYPosition = game.world.height - 550;
    var randomYPos = [100,300,450];
    
    if (randomXPosition === undefined){
        randomXPosition = game.rnd.integerInRange(12, 858);
        randomYPosition = randomYPos[game.rnd.integerInRange(0, 2)];
        console.log('Y: ' + randomYPosition);
    }
	player.reset(randomXPosition, randomYPosition);
}

function p2Reborn(randomXPosition) {
    var randomYPosition = game.world.height - 550;
    var randomYPos = [100,300,450];
    
    if (randomXPosition === undefined){
        randomXPosition = game.rnd.integerInRange(12, 858);
        randomYPosition = randomYPos[game.rnd.integerInRange(0, 2)];
        console.log('Y: ' + randomYPosition);
    }
	otherPlayer.reset(randomXPosition, randomYPosition);
}

function upgradeWeapon() {
	// player 1
	if(score >= 20) {
	    p1CurrentWeapon = 1;
        p1Weapons[p1CurrentWeapon].setAll('scaleSpeed', 0);
	}
	else if(score >= 10)
		p1Weapons[p1CurrentWeapon].setAll('scaleSpeed', 0.02);

	// player 2
	if(score2 >= 20) {
		p2CurrentWeapon = 1;
	    p2Weapons[p2CurrentWeapon].setAll('scaleSpeed', 0);
	}
	else if(score2 >= 10)
		p2Weapons[p2CurrentWeapon].setAll('scaleSpeed', 0.02);
}


}());