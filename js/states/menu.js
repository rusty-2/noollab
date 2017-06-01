define([], function() {
    function Menu(game) {

    };

    function start(mode) {

        this.game.state.start("Main", true, false, mode);
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

            var standardModeButton = game.add.button(game.world.width / 2 - 40, game.world.height - 250,
                'single_player_button', start.bind(this, 'standard'), this, 1, 0, 2);

            var multiplayerModeButton = game.add.button(game.world.width / 2 - 40, game.world.height - 200,
                'multi_player_button', start.bind(this, 'multiplayer'), this, 1, 0, 2);

            var stayingAliveModeButton = game.add.button(game.world.width / 2 - 40, game.world.height - 150,
                'staying_alive_button', null, this, 1, 0, 2);

            var highscoresButton = game.add.button(game.world.width / 2 - 40, game.world.height - 100,
                'highscores_button', null, this, 1, 0, 2);
        },

    }
    return Menu;
});
