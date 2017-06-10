define([], function() {
    function Bonus(game, x, y, type) {
        switch(type) {
            case 'firstaid':
                Phaser.Sprite.call(this, game, x, y, 'firstaid');
                break;

            case 'diamond':
                Phaser.Sprite.call(this, game, x, y, 'diamond');
                break;

            default:
                Phaser.Sprite.call(this, game, x, y, 'firstaid');
                break;
        }
    };

    Bonus.prototype = Object.create(Phaser.Sprite.prototype);
    Bonus.prototype.constructor = Bonus;

    return Bonus;
});
