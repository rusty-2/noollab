var Menu = function(game){

};

Menu.prototype = {

	preload: function(){

	},

  	create: function(){
        var nameLabel = game.add.text(game.world.width/2 - 100, game.world.height/2, 'Noolab',
                        { font: '50px Arial', fill: '#ffffff'} );

        var startLabel = game.add.text(game.world.width/2 - 135, game.world.height - 80,
                        'Press \'Space\' to start!', { font: '25px Arial', fill: '#ffffff'} );

        var spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        spaceKey.onDown.addOnce(this.start, this);
	},

    start: function() {

        this.game.state.start("Main");
    }
}
