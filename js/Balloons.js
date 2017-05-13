var Balloons = function (game) {
  Phaser.Group.call(this, game);
  this.game = game;

  this.enableBody = true; //  We will enable physics for any object that is created in this group

  };


Balloons.prototype = Object.create(Phaser.Group.prototype);
Balloons.prototype.constructor = Balloons;

Balloons.prototype.create = function (x, y) {
  var balloon = new Balloon(this.game, x, y);
  this.add(balloon);
  balloon.body.gravity.y = 60;
  balloon.body.bounce.y = 0.4 + Math.random() * 0.2;     //  This just gives each balloon a slightly random bounce value
  balloon.body.collideWorldBounds = true;
  return balloon;
};

Balloons.prototype.anyAlive = function() {
  return this.total > 0;
};
