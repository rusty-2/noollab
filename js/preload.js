var Preload = function(game){};

Preload.prototype = {

    preload: function() {
    	game.load.image('sky', 'assets/sky.png');
    	game.load.image('ground', 'assets/platform.png');
    	game.load.image('balloon', 'assets/balloon.png');
        game.load.image('bullet', 'assets/bullet.png');
    	game.load.spritesheet('dude', 'assets/dude.png', 32, 48);

    },

    create: function() {
    		this.game.state.start("Menu");
    	}
    }
