var Bullets = function(game) {
    Phaser.Group.call(this, game);
    this.enableBody = true;
    this.physicsBodyType = Phaser.Physics.ARCADE;
    this.createMultiple(10, 'bullet');
    this.callAll('events.onOutOfBounds.add', 'events.onOutOfBounds', resetBullet, this);
    this.setAll('checkWorldBounds', true);
};

//  Called if the bullet goes out of the screen
function resetBullet(bullet) {
    bullet.kill();
}

Bullets.prototype = Object.create(Phaser.Group.prototype);
Bullets.prototype.constructor = Bullets;
