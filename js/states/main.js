define([
    "Balloons",
    "Bullets",
    "Hearts",
    "Platforms",
    "Player",
    "utils/TextBuilder",
    "levels/level1",
    "levels/level2",
    "levels/level3"
], function(Balloons, Bullets, Hearts, Platforms, Player, TextBuilder, level1, level2, level3) {
    function Main(game) {
        this.score = 0;
        this.bulletTime = 0;
    }

    function currentTime() {
        return game.time.now;
    }

    function hitBalloon(bullet, balloon) {
        // Removes the bullet from the screen
        bullet.kill();

        if (balloon.shrinkable()) {
            var x = balloon.xPos();
            var y = balloon.yPos();
            var firstNewBalloon = this.balloons.createRelativeTo(x, y, true);
            var secondNewBalloon = this.balloons.createRelativeTo(x, y, false);
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
        if (currentTime() > this.bulletTime) {
            bullet = this.bullets.getFirstExists(false);

            if (bullet) {
                bullet.reset(this.player.xPos() + 6, this.player.yPos() - 8);
                bullet.body.velocity.y = -300;
                this.bulletTime = currentTime() + 250;
            }
        }
    }

    function spawnHeart(x, y) {
        heart = this.hearts.getFirstExists(false);
        heart.reset(x, y);

        return heart;
    }

    function endGame() {
        this.timer.stop();
        scoreText.destroy();

        new TextBuilder(game)
       .setText('Final score: ' + this.score)
       .middle()
       .build();

        new TextBuilder(game)
       .setText('Press \'Space\' to get back to menu screen')
       .bottom()
       .build();

        this.spaceKey.onDown.addOnce(backToMenu, this);
    }

    function chooseNextAction() {
        this.timer.stop();
        this.timer.destroy();
        new TextBuilder(game)
       .setText('Score after level ' + this.game.levels.current + ' : ' + this.score)
       .middle()
       .build();

        new TextBuilder(game)
       .setText('Press \'Space\' to go to Menu, Enter to play next level')
       .bottom()
       .build();

        this.spaceKey.onDown.addOnce(backToMenu, this);
        this.enterKey.onDown.addOnce(goToNextLevel, this);
    }

    function backToMenu() {
        this.score = 0;
        this.game.state.start("Menu");
    }

    function goToNextLevel() {
        if (this.game.levels.current < 3) {
            this.game.levels.current++;
        } else {
            this.game.levels.current = 1;
        }
        this.game.state.start("Main", true, false, this.mode);
    }

    function handleKeyboardInput() {
        var cursors = game.input.keyboard.createCursorKeys();

        this.player.resetMovement();
        if (cursors.left.isDown) {
            this.player.moveLeft();
        } else if (cursors.right.isDown) {
            this.player.moveRight();
        } else {
            this.player.stop();
        }

        if (this.spaceKey.isDown) {
            fireBullet.call(this);
        }
    }

    function createTimeBar() {
        var originalTimeBarWidth = this.timeBar.width;
        this.timer = game.time.create(false);
        this.timer.repeat(Phaser.Timer.SECOND, this.currentLevel.time, updateTimeBar, this, originalTimeBarWidth, this.currentLevel.time);

        this.timer.add(Phaser.Timer.SECOND * this.currentLevel.time, handleTimeEnded, this);
        this.timer.start();
    }

    function updateTimeBar(originalWidth, time) {
        this.timeBar.width -= originalWidth / time;
    }

    function handleTimeEnded() {
        this.timer.destroy();
        endGame.call(this);
    }

    function initText() {
      scoreText = new TextBuilder(game)
      .setText( 'Score: ' + this.score)
      .setX(16)
      .setY(16)
      .build();

      var levelText = new TextBuilder(game)
      .setText('Level: ' + this.game.levels.current)
      .middle()
      .build();

      game.time.events.add(Phaser.Timer.SECOND, function() {
          levelText.destroy();
      }, this);
    }

    Main.prototype = {

        init: function(mode) {
            this.mode = mode;
        },

        create: function() {
            var levels = [level1, level2, level3];
            this.currentLevel = levels[game.levels.current - 1];
            game.add.sprite(0, 0, 'sky');

            this.platforms = new Platforms(game);
            this.ground = this.platforms.createGround(0, game.world.height - 64);
            this.timeBar = this.platforms.createTimeBar(0, game.world.height - 32);

            this.player = new Player(this.game, game.world.width / 2, game.world.height - 150);

            this.balloons = new Balloons(game);
            this.balloons.createForConfig(this.currentLevel.balloons);

            this.bullets = new Bullets(game);

            this.hearts = new Hearts(game);

            this.heartsArray = [
                spawnHeart.call(this, game.world.width - 135, 5),
                spawnHeart.call(this, game.world.width - 90, 5),
                spawnHeart.call(this, game.world.width - 45, 5)
            ];

            initText.call(this);

            // Used in update to prevent infinite collisions
            this.collisionDelay = 0;

            // Used in update to make blinking visible
            this.blinkDelay = 0;

            this.spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
            this.enterKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);

            //  Stop the following keys from propagating up to the browser
            game.input.keyboard.addKeyCapture([Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT, Phaser.Keyboard.SPACEBAR, Phaser.Keyboard.ENTER]);

            createTimeBar.call(this);
        },

        update: function() {
            //  Collide the player and the balloons with the platforms
            game.physics.arcade.collide(this.player, this.platforms);
            game.physics.arcade.collide(this.balloons, this.platforms);

            if (this.player.overlapWith(this.balloons)) {
                if (currentTime() > this.collisionDelay) {
                    this.player.endLife();
                    this.collisionDelay = currentTime() + 1000;

                    this.player.blinkCounter = 4;
                    this.playerBlinking = this.player.blink();
                    this.blinkDelay = currentTime() + 250;

                    this.heartsArray[this.player.lives].kill();
                }
            }

            if (this.playerBlinking == true && currentTime() > this.blinkDelay) {
                this.playerBlinking = this.player.blink();
                this.blinkDelay = currentTime() + 250;
            }

            if (!this.player.isAlive()) {
                endGame.call(this);
            } else if (!this.balloons.anyAlive()) {
                chooseNextAction.call(this);
            }

            handleKeyboardInput.call(this);

            game.physics.arcade.overlap(this.bullets, this.balloons, hitBalloon, null, this);
        }
    };

    return Main;
});
