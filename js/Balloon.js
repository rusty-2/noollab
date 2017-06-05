define([], function() {
    function Balloon(game, x, y) {
        Phaser.Sprite.call(this, game, x, y, 'balloon');

    };

    Balloon.prototype = Object.create(Phaser.Sprite.prototype);
    Balloon.prototype.constructor = Balloon;

    Balloon.prototype.setLevel = function(level) {
        this.level = level;
        this.scale.setTo(this.level + 0.5, this.level + 0.5);
        //this.body.gravity.y = (4 - level) * 100;
    };

    Balloon.prototype.shrinkable = function() {
        return this.level > 0;
    };

    Balloon.prototype.xPos = function() {
        return this.body.x;
    };

    Balloon.prototype.yPos = function() {
        return this.body.y;
    };

    return Balloon;
});
