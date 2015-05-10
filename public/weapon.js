var Bullet = function (game, key) {
    Phaser.Sprite.call(this, game, 0, 0, key);

    this.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;

    this.anchor.set(0.5);

    this.checkWorldBounds = true;
    this.outOfBoundsKill = true;
    this.exists = false;

    this.tracking = false;
    this.scaleSpeed = 0;

    this.enableBody = true;
};

Bullet.prototype = Object.create(Phaser.Sprite.prototype);
Bullet.prototype.constructor = Bullet;

Bullet.prototype.fire = function (x, y, angle, speed, gx, gy) {
    gx = gx || 0;
    gy = gy || 0;

    this.reset(x, y);
    this.scale.set(1);

    this.game.physics.arcade.velocityFromAngle(angle, speed, this.body.velocity);

    this.angle = angle;

    this.body.gravity.set(gx, gy);

    game.sound.play('fire');
};

Bullet.prototype.update = function () {
    if (this.tracking) {
        this.rotation = Math.atan2(this.body.velocity.y, this.body.velocity.x);
    }

    if (this.scaleSpeed > 0) {
        this.scale.x += this.scaleSpeed;
        this.scale.y += this.scaleSpeed;
    }
    
    if(this.body.velocity.x == 0 && this.body.velocity.y == 0) {
        this.kill();
    }
};

var Weapon = {};

Weapon.Rockets = function (game) {
    Phaser.Group.call(this, game, game.world, 'Rockets', false, true, Phaser.Physics.ARCADE);

    this.nextFire = 0;
    this.bulletSpeed = 400;
    this.fireRate = 1000;

    for (var i = 0; i < 32; i++) {
        this.add(new Bullet(game, 'bullet10'), true);
    }

    this.setAll('tracking', true);

    return this;
};

Weapon.Rockets.prototype = Object.create(Phaser.Group.prototype);
Weapon.Rockets.prototype.constructor = Weapon.Rockets;

Weapon.Rockets.prototype.fire = function (source,rocketLRDirection,rocketDirection,faceDirection) {
    if (this.game.time.time < this.nextFire) { return; }

    var x = source.x + 10;
    var y = source.y + 10;

    // control rocket directions
    if(rocketLRDirection == "none" && rocketDirection == "up" && faceDirection == "left")
        this.getFirstExists(false).fire(x, y, -90, this.bulletSpeed, -500, 300);    // up
    else if(rocketLRDirection == "none" && rocketDirection == "up" && faceDirection == "right")
        this.getFirstExists(false).fire(x, y, -90, this.bulletSpeed, 500, 300);     // up
    else if(rocketLRDirection == "none" && rocketDirection == "down" && faceDirection == "left")
        this.getFirstExists(false).fire(x, y, 90, this.bulletSpeed, -500, 300);     // down
    else if(rocketLRDirection == "none" && rocketDirection == "down" && faceDirection == "right")
        this.getFirstExists(false).fire(x, y, 90, this.bulletSpeed, 500, 300);      // down
    else if(faceDirection == "left" && rocketDirection == "none")
        this.getFirstExists(false).fire(x, y, -170, this.bulletSpeed, -500, 300);   // left
    else if(faceDirection == "right" && rocketDirection == "none")
        this.getFirstExists(false).fire(x, y, -10, this.bulletSpeed, 500, 300);     // right

    this.nextFire = this.game.time.time + this.fireRate;
};

Weapon.RocketsX3 = function (game) {
    Phaser.Group.call(this, game, game.world, 'RocketsX3', false, true, Phaser.Physics.ARCADE);

    this.nextFire = 0;
    this.bulletSpeed = 400;
    this.fireRate = 1000;

    for (var i = 0; i < 32; i++) {
        this.add(new Bullet(game, 'bullet10'), true);
    }

    this.setAll('tracking', true);

    return this;
};

Weapon.RocketsX3.prototype = Object.create(Phaser.Group.prototype);
Weapon.RocketsX3.prototype.constructor = Weapon.RocketsX3;

Weapon.RocketsX3.prototype.fire = function (source,rocketLRDirection,rocketDirection,faceDirection) {
    if (this.game.time.time < this.nextFire) { return; }

    var x = source.x + 10;
    var y = source.y + 10;

    // control rocket directions
    if(faceDirection == "left") {
        this.getFirstExists(false).fire(x, y, -90, this.bulletSpeed, -500, 300);    // up
        this.getFirstExists(false).fire(x, y, -170, this.bulletSpeed, -500, 300);   // left
        this.getFirstExists(false).fire(x, y, 90, this.bulletSpeed, -500, 300);     // down
    }
    else if(faceDirection == "right") {
        this.getFirstExists(false).fire(x, y, -90, this.bulletSpeed, 500, 300);     // up
        this.getFirstExists(false).fire(x, y, -10, this.bulletSpeed, 500, 300);     // right
        this.getFirstExists(false).fire(x, y, 90, this.bulletSpeed, 500, 300);      // down
    }
        
    this.nextFire = this.game.time.time + this.fireRate;
};
