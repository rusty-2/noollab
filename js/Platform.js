define([], function() {
    function Platform(game, x, y) {
        Phaser.Sprite.call(this, game, x, y, 'ground');


        game.add.group(this);
    };

    Platform.prototype = Object.create(Phaser.Sprite.prototype);
    Platform.prototype.constructor = Platform;

    return Platform;
});
