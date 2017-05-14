define([
    "Balloons",
    "Bullets",
    "Platforms",
    "Player"
], function(Balloons, Bullets, Platforms, Player) {
    function Main(game) {
        this.score = 0;
        this.bulletTime = 0;
    }

    function hitBalloon(bullet, balloon) {
        // Removes the bullet from the screen
        bullet.kill();

        if (balloon.shrinkable()) {
            var firstNewBalloon = this.balloons.createRelativeTo(balloon);
            var secondNewBalloon = this.balloons.createRelativeTo(balloon);
            var newLevel = --balloon.level;
            firstNewBalloon.setLevel(newLevel);
            secondNewBalloon.setLevel(newLevel);
        }
        // Removes the balloon from the screen
        balloon.kill();

        //  Add and update the score
        this.score += 10;
        scoreText.text = 'Score: ' + this.score;
    }

    function fireBullet() {
        if (game.time.now > this.bulletTime) {
            bullet = this.bullets.getFirstExists(false);

            if (bullet) {
                bullet.reset(this.player.xPos() + 6, this.player.yPos() - 8);
                bullet.body.velocity.y = -300;
                this.bulletTime = game.time.now + 250;
            }
        }
    }

    function endGame() {
        scoreText.text = '';
        livesText.text = '';

        var finalScoreText = game.add.text(game.world.width / 2 - 100, game.world.height / 2,
            'Final score: ' + this.score, {
                fontSize: '32px',
                fill: '#000'
            });
        var restartText = game.add.text(game.world.width / 2 - 275, game.world.height - 55,
            'Press \'Space\' to get back to menu screen');

        this.spaceKey.onDown.addOnce(backToMenu, this);
    }

    function backToMenu() {
        this.score = 0;
        this.game.state.start("Menu");
    }

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
            scoreText = game.add.text(16, 16, 'Score: 0', {
                fontSize: '32px',
                fill: '#000'
            });

            livesText = game.add.text(game.world.width - 120, 16, 'Lives: 3', {
                fontSize: '32px',
                fill: '#000'
            });

            // Used in update to prevent infinite collisions
            this.timeDelay = 0;

            this.spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

            //  Stop the following keys from propagating up to the browser
            game.input.keyboard.addKeyCapture([Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT, Phaser.Keyboard.SPACEBAR]);
        },

        update: function() {
            //  Collide the player and the balloons with the platforms
            game.physics.arcade.collide(this.player, this.platforms);
            game.physics.arcade.collide(this.balloons, this.platforms);

            if (this.player.collideWith(this.balloons)) {
                if (game.time.now > this.timeDelay) {
                    this.player.lives--;
                    this.timeDelay = game.time.now + 1000;

                    livesText.text = 'Lives: ' + this.player.lives;
                }
            }

            if (this.player.lives == 0 || !this.balloons.anyAlive()) {
                endGame.call(this);
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
                fireBullet.call(this);
            }

            game.physics.arcade.overlap(this.bullets, this.balloons, hitBalloon, null, this);
        }
    };

    return Main;
});
