define(["Bonus"], function(Bonus) {
    function Bonuses(game) {
        Phaser.Group.call(this, game);
        this.game = game;

        this.enableBody = true; //  We will enable physics for any object that is created in this group
        this.physicsBodyType = Phaser.Physics.ARCADE;
    };

    Bonuses.prototype = Object.create(Phaser.Group.prototype);
    Bonuses.prototype.constructor = Bonuses;

    Bonuses.prototype.create = function(x, y) {
        var bonusType = game.rnd.integerInRange(0, 5);
        switch (bonusType) {
            default:
                var bonus = new Bonus(this.game, x, y, 'heart');
                bonus.type = 'heart';
        }

        this.add(bonus);
        bonus.body.gravity.y = 200;
        bonus.body.velocity.x = 0;
        bonus.body.velocity.y = 150;
        bonus.body.bounce.setTo(1,0.5);
        bonus.body.collideWorldBounds = true;

        return bonus;
    };

    return Bonuses;
});
