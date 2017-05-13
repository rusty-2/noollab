define([], function() {
    function Menu(game) {

    };

    Menu.prototype = {

        preload: function() {

        },

        create: function() {
            var nameLabel = game.add.text(game.world.width / 2 - 65, game.world.height / 2, 'Noollab', {
                font: '50px Arial',
                fill: '#ffffff'
            });

            var button = game.add.button(game.world.width / 2 - 80, game.world.height - 100,
                'start_button', this.actionOnClick, this, 2, 1, 0);

            //var startLabel = game.add.text(game.world.width/2 - 100, game.world.height - 80,
            //                'Press \'Space\' to start!', { font: '25px Arial', fill: '#ffffff'} );

            var spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

            spaceKey.onDown.addOnce(this.start, this);
        },

        start: function() {

            this.game.state.start("Main");
        },

        actionOnClick: function() {

            this.game.state.start("Main");

        }
    }
    return Menu;
});
