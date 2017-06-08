define([], function() {
    function Bonus(game, x, y, type) {
        switch(type) {
            case 'heart':
                Phaser.Sprite.call(this, game, x, y, 'heart');
                break;

            default:
                Phaser.Sprite.call(this, game, x, y, 'heart');
                break;
        }
    };

    Bonus.prototype = Object.create(Phaser.Sprite.prototype);
    Bonus.prototype.constructor = Bonus;

    return Bonus;
});
