define([], function() {
    function Player(game, x, y) {
        Phaser.Sprite.call(this, game, x, y, 'dude');
        this.game = game;
        //  We need to enable physics on the player
        game.physics.arcade.enable(this);

        //  Player physics properties. Give the little guy a slight bounce.
        this.body.bounce.y = 0.2;
        this.body.gravity.y = 300;
        this.body.collideWorldBounds = true;

        //  Our two animations, walking left and right.
        this.animations.add('left', [0, 1, 2, 3], 10, true);
        this.animations.add('right', [5, 6, 7, 8], 10, true);

        this.lives = 3;
        this.blinkCounter = 0;
        this.isBlinking = false;

        game.add.existing(this);
    };

    function setSpeed(speed) {
        this.body.velocity.x = speed;
    }

    Player.prototype = Object.create(Phaser.Sprite.prototype);
    Player.prototype.constructor = Player;

    Player.prototype.resetMovement = function() {
        setSpeed.call(this, 0);
    };

    Player.prototype.moveRight = function() {
        setSpeed.call(this, 150);
        this.animations.play('right');
    };

    Player.prototype.moveLeft = function() {
        setSpeed.call(this, -150);
        this.animations.play('left');
    };

    Player.prototype.stop = function() {
        this.animations.stop();
        this.frame = 4;
    };

    Player.prototype.xPos = function() {
        return this.body.x;
    };

    Player.prototype.yPos = function() {
        return this.body.y;
    };

    Player.prototype.overlapWith = function(object) {
        return this.game.physics.arcade.overlap(this, object);
    };

    Player.prototype.blink = function() {
        if( this.tint == 0xffffff) {
            this.tint = 0xff0000
            this.alpha = 0.7;
        } else {
            this.tint = 0xffffff;
            this.alpha = 1;
        }

        if(--this.blinkCounter == 0) {
            return false;
        } else {
            return true;
        }
    };

    Player.prototype.endLife = function() {
        if(this.isAlive()) {
            this.lives--;
        }
    }

    Player.prototype.isAlive = function() {
      return this.lives > 0;
    }

    return Player;
});
