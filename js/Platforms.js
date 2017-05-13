define(["Platform"], function(Platform) {
    function Platforms(game) {
        Phaser.Group.call(this, game);
        this.game = game;

        this.enableBody = true; //  We will enable physics for any object that is created in this group

        game.add.group(this);
    };


    Platforms.prototype = Object.create(Phaser.Group.prototype);
    Platforms.prototype.constructor = Platforms;

    Platforms.prototype.createGround = function(x, y, key) {
        var obj = new Platform(this.game, x, y, key);
        this.add(obj);
        obj.scale.setTo(2, 2); //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
        obj.body.immovable = true; //  This stops it from falling away when you jump on it
        return obj;
    };
    return Platforms;
});
