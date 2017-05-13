var Boot = function(game){

};

Boot.prototype = {

	preload: function(){

	},

  	create: function(){
        
        //  We're going to be using physics, so enable the Arcade Physics system
        game.physics.startSystem(Phaser.Physics.ARCADE);

		this.game.state.start("Preload");
	}
}
