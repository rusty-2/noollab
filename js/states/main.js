define([
    "Balloons",
    "Bullets",
    "Platforms",
    "Player"
], function(Balloons, Bullets, Platforms, Player) {
    function Main(game) {

        this.score = 0;
        this.bulletTime = 0;

    };

    Main.prototype = {

        create: function() {

            //  A simple background for our game
            game.add.sprite(0, 0, 'sky');

            this.platforms = new Platforms(game);
            this.ground = this.platforms.createGround(0, game.world.height - 64);

            // The player and its settings
            this.player = new Player(this.game, game.world.width / 2, game.world.height - 150);

            this.balloons = new Balloons(game);
            this.balloon = this.balloons.create(Math.random() * 800, 0);
            this.balloon.setLevel(2);

            this.bullets = new Bullets(game);
            scoreText = game.add.text(16, 16, 'score: 0', {
                fontSize: '32px',
                fill: '#000'
            });

            this.spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

            //  Stop the following keys from propagating up to the browser
            game.input.keyboard.addKeyCapture([Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT, Phaser.Keyboard.SPACEBAR]);
        },

        update: function() {
            //  Collide the player and the balloons with the platforms
            game.physics.arcade.collide(this.player, this.platforms);
            game.physics.arcade.collide(this.balloons, this.platforms);

            if (this.player.collideWith(this.balloons) || !this.balloons.anyAlive()) {
                this.endGame();
            }

            var cursors = game.input.keyboard.createCursorKeys();

            //  Reset the players velocity (movement)
            this.player.resetMovement();
            if (cursors.left.isDown) {
                //  Move to the left
                this.player.moveLeft();
            } else if (cursors.right.isDown) {
                //  Move to the right
                this.player.moveRight();
            } else {
                //  Stand still
                this.player.stop();
            }

            if (this.spaceKey.isDown) {
                this.fireBullet();
            }

            game.physics.arcade.overlap(this.bullets, this.balloons, this.hitBalloon, null, this);
        },

        hitBalloon: function(bullet, balloon) {

            // Removes the balloon from the screen
            bullet.kill();

            if (balloon.level > 0) {

                var firstNewBalloon = this.balloons.create(balloon.body.x - Math.random() * 50 + Math.random() * 50,
                    balloon.body.y - Math.random() * 25 + Math.random() * 25);
                var secondNewBalloon = this.balloons.create(balloon.body.x - Math.random() * 50 + Math.random() * 50,
                    balloon.body.y - Math.random() * 25 + Math.random() * 25);
                var newLevel = --balloon.level;
                firstNewBalloon.setLevel(newLevel);
                secondNewBalloon.setLevel(newLevel);
            }

            balloon.kill();

            //  Add and update the score
            this.score += 10;
            scoreText.text = 'Score: ' + this.score;
        },

        fireBullet: function() {

            if (game.time.now > this.bulletTime) {
                bullet = this.bullets.getFirstExists(false);

                if (bullet) {
                    bullet.reset(this.player.xPos() + 6, this.player.yPos() - 8);
                    bullet.body.velocity.y = -300;
                    this.bulletTime = game.time.now + 250;
                }
            }
        },



        endGame: function() {
            scoreText.text = '';

            var finalScoreText = game.add.text(game.world.width / 2 - 100, game.world.height / 2,
                'Final score: ' + this.score, {
                    fontSize: '32px',
                    fill: '#000'
                });
            var restartText = game.add.text(game.world.width / 2 - 275, game.world.height - 55,
                'Press \'Space\' to get back to menu screen');

            this.spaceKey.onDown.addOnce(this.backToMenu, this);
        },

        backToMenu: function() {

            this.score = 0;

            this.game.state.start("Menu");
        },
    };

    return Main;
});
