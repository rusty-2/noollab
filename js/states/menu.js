define([], function() {
    function Menu(game) {

    };

    function start() {

        this.game.state.start("Main");
    },

    function actionOnClick() {

        this.game.state.start("Main");

    }

    Menu.prototype = {

        preload: function() {
            this.game.levels = {
                current: 1
            };
        },

        create: function() {
            var nameLabel = game.add.text(game.world.width / 2 - 65, game.world.height / 2, 'Noollab', {
                font: '50px Arial',
                fill: '#ffffff'
            });

            var button = game.add.button(game.world.width / 2 - 80, game.world.height - 100,
                'start_button', actionOnClick, this, 2, 1, 0);

            //var startLabel = game.add.text(game.world.width/2 - 100, game.world.height - 80,
            //                'Press \'Space\' to start!', { font: '25px Arial', fill: '#ffffff'} );

            var spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

            spaceKey.onDown.addOnce(start, this);
        },

    }
    return Menu;
});
