define([], function() {
    function Menu(game) {

    };

    function start() {

        this.game.state.start("Main");
    }

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

            game.add.sprite(0, 0, 'sky');

            game.add.sprite(250, 50, 'logo');

            var button = game.add.button(game.world.width / 2 - 96.5, game.world.height - 100,
                'start_button', actionOnClick, this, 2, 1, 0);

            var spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

            spaceKey.onDown.addOnce(start, this);
        },

    }
    return Menu;
});
