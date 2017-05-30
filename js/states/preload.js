define([], function() {
  function Preload(game){};

Preload.prototype = {

    preload: function() {
    	game.load.image('sky', 'assets/sky.png');
    	game.load.image('ground', 'assets/platform.png');
    	game.load.image('balloon', 'assets/balloon.png');
        game.load.image('bullet', 'assets/bullet.png');
        game.load.image('logo', 'assets/logo.png');
        game.load.image('heart', 'assets/heart.png');
        game.load.spritesheet('start_button','assets/button_sprite_sheet.png', 193, 71);
    	game.load.spritesheet('dude', 'assets/dude.png', 32, 48);

    },

    create: function() {
    		this.game.state.start("Menu");
    	}
    }

    return Preload;
});
