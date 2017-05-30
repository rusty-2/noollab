define([], function() {
    function Hearts(game) {
        Phaser.Group.call(this, game);
        this.createMultiple(3, 'heart');
    };

    Hearts.prototype = Object.create(Phaser.Group.prototype);
    Hearts.prototype.constructor = Hearts;

    return Hearts;
});
