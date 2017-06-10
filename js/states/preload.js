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
        game.load.image('firstaid', 'assets/firstaid.png');
        game.load.image('diamond', 'assets/diamond.png');
        game.load.spritesheet('single_player_button','assets/single_player_button.png', 87, 32);
        game.load.spritesheet('multi_player_button','assets/multi_player_button.png', 87, 32);
        game.load.spritesheet('staying_alive_button','assets/staying_alive_button.png', 87, 32);
        game.load.spritesheet('next_button','assets/next_button_2.png', 87, 32);
        game.load.spritesheet('menu_button','assets/menu_button_2.png', 87, 32);
    	game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
        game.load.spritesheet('dude2', 'assets/dude2.png', 32, 48);

    },

    create: function() {
    		this.game.state.start("Menu");
    	}
    }

    return Preload;
});
