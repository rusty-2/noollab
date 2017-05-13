var Balloon = function (game, x , y) {
  Phaser.Sprite.call(this, game, x, y, 'balloon');

};

Balloon.prototype = Object.create(Phaser.Sprite.prototype);
Balloon.prototype.constructor = Balloon;

Balloon.prototype.setLevel = function(level) {
    this.level = level;
    this.scale.setTo(this.level + 0.5, this.level + 0.5);
};
