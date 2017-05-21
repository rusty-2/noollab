define(["Balloon"], function(Balloon) {
  var GRAVITY = 40;
  var POSITION_CHANGE = 40;
    function Balloons(game) {
        Phaser.Group.call(this, game);
        this.game = game;

        this.enableBody = true; //  We will enable physics for any object that is created in this group
        this.physicsBodyType = Phaser.Physics.ARCADE;
    };


    Balloons.prototype = Object.create(Phaser.Group.prototype);
    Balloons.prototype.constructor = Balloons;

    Balloons.prototype.create = function(x, y, xGravity) {
        var balloon = new Balloon(this.game, x, y);
        this.add(balloon);
        balloon.body.gravity.y = 60;
        balloon.body.velocity.x = xGravity;
        balloon.body.bounce.setTo(0,0.7) //  This just gives each balloon a slightly random bounce value
        balloon.body.collideWorldBounds = true;
        return balloon;
    };

    Balloons.prototype.createRelativeTo = function (x, y, right) {
      if(right) {
        return this.create(x + POSITION_CHANGE, y - POSITION_CHANGE, GRAVITY);
      }

      return this.create(x - POSITION_CHANGE, y - POSITION_CHANGE, -GRAVITY);
    }

    Balloons.prototype.anyAlive = function() {
        return this.total > 0;
    };
    return Balloons;
});
