var Player = function(game, x , y) {
    Phaser.Sprite.call(this, game, x, y, 'dude');

//  We need to enable physics on the player
    game.physics.arcade.enable(this);

//  Player physics properties. Give the little guy a slight bounce.
    this.body.bounce.y = 0.2;
    this.body.gravity.y = 300;
    this.body.collideWorldBounds = true;

//  Our two animations, walking left and right.
    this.animations.add('left', [0, 1, 2, 3], 10, true);
    this.animations.add('right', [5, 6, 7, 8], 10, true);

    game.add.existing(this);
};

function setSpeed(speed) {
  this.body.velocity.x = speed;
}

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.resetMovement = function() {
    setSpeed.call(this,0);
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