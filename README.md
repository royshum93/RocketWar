# RocketWar

CSCI 4140 Project - Rocket War

Group Name: RS Studio
# Features
-	2D Physics: jumping of character, locus of rocket, etc.
-	Multiplayer
-	Network connection, server for hosting the game
-	Different weapons
-	Kill bonus: acceleration, higher damage, etc.
-	Scores
-	Spectate Mode (New!)

# Programming challenges/libraries involved
-	Real-time actions with acceptable delay (direct websocket connection)
-	Handling multiplayer, synchronization
-	Object movements, collision detections
-	Game framework: Phaser
-	Network framework: Socket.io

# Deployment scenarios
-	2 players game
-	Require more than one computer (browser)
-	Server at one of the clients

# Run the Project
1. git clone https://github.com/royshum93/RocketWar.git
2. cd RocketWar
3. npm install
4. node server.js


# Milestones
Milestone 1: Basic Map and Character setup (10, 2 players)
	-	Basic Scene for showing the characters 
	-	Own character is able to control freely
	-	Characters can interact with own character (1 player, 10)
(Player can shoot the rocket, collision detection, gravity)

Milestone 2: Scene enrichments (5)
	-	Obstacles on the scene
	-	Different weapons for players
	-	Player stats manipulation and display
	-	Scene Transition: Game start and end


Milestone 4: Extra in-game items (5)
	-	extra in-game items for players to pick up and enrich their characters
	-	bonus effect on killing other players


# References (our own use)
-	https://www.youtube.com/watch?v=6UaACK2wglQ
-	https://github.com/cherrry/N-Mario
