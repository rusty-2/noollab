define([
    "Balloons",
    "Bullets",
    "Platforms",
    "Player",
    "levels/level1",
    "levels/level2"
], function(Balloons, Bullets, Platforms, Player, level1, level2) {
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

    function endGame() {
        scoreText.text = '';
        livesText.text = '';

        var finalScoreText = game.add.text(game.world.width / 2 - 100, game.world.height / 2,
            'Final score: ' + this.score, {
                fontSize: '32px',
                fill: '#000'
            });
        var restartText = game.add.text(game.world.width / 2 - 275, game.world.height - 55,
            'Press \'Space\' to get back to menu screen, Enter to play next level');

        this.spaceKey.onDown.addOnce(backToMenu, this);
        this.enterKey.onDown.addOnce(goToNextLevel, this);
    }

    function backToMenu() {
        this.score = 0;
        this.game.state.start("Menu");
    }

    function goToNextLevel() {
      if(this.game.levels.current<2){
         this.game.levels.current++;
      } else {
        this.game.levels.current = 1;
      }
      this.game.state.start("Main");
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

    Main.prototype = {

        create: function() {
            var levels = [level1, level2];
            this.currentLevel = levels[game.levels.current-1];
            //  A simple background for our game
            game.add.sprite(0, 0, 'sky');

            this.platforms = new Platforms(game);
            this.ground = this.platforms.createGround(0, game.world.height - 64);

            // The player and its settings
            this.player = new Player(this.game, game.world.width / 2, game.world.height - 150);

            this.balloons = new Balloons(game);
            this.balloon = this.balloons.create(400-25/2, 200, 0);
            this.balloon.setLevel(this.currentLevel.balloon.level);


            this.bullets = new Bullets(game);
            scoreText = game.add.text(16, 16, 'Score: ' + this.score, {
                fontSize: '32px',
                fill: '#000'
            });

            livesText = game.add.text(game.world.width - 120, 16, 'Lives: ' + this.player.lives, {
                fontSize: '32px',
                fill: '#000'
            });

            levelText = game.add.text(game.world.width/2 -15, game.world.height/2 -15, 'Level: ' + this.game.levels.current, {
                fontSize: '32px',
                fill: '#000'
            });


            game.time.events.add(Phaser.Timer.SECOND, function() {
              levelText.destroy();
            }, this);


            // Used in update to prevent infinite collisions
            this.collisionDelay = 0;

            // Used in update to make blinking visible
            this.blinkDelay = 0;

            this.spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
            this.enterKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);

            //  Stop the following keys from propagating up to the browser
            game.input.keyboard.addKeyCapture([Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT, Phaser.Keyboard.SPACEBAR, Phaser.Keyboard.ENTER]);
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

                    livesText.text = 'Lives: ' + this.player.lives;
                }
            }

            if(this.playerBlinking == true && currentTime() > this.blinkDelay) {
                this.playerBlinking = this.player.blink();
                this.blinkDelay = currentTime() + 250;
            }

            if (!this.player.isAlive() || !this.balloons.anyAlive()) {
                endGame.call(this);
            }

            handleKeyboardInput.call(this);

            game.physics.arcade.overlap(this.bullets, this.balloons, hitBalloon, null, this);
        }
    };

    return Main;
});
