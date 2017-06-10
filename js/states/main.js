define([
    "Balloons",
    "Bonuses",
    "Bullets",
    "Hearts",
    "Platforms",
    "Player",
    "utils/TextBuilder",
    "levels/level1",
    "levels/level2",
    "levels/level3"
], function(Balloons, Bonuses, Bullets, Hearts, Platforms, Player, TextBuilder, level1, level2, level3) {
    function Main(game) {
        this.score = 0;
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

        var magicBonusVariable = game.rnd.integerInRange(0, 100);
        if(magicBonusVariable > 95) {
            spawnBonus.call(this, balloon.xPos(), balloon.yPos());
        }

        // Removes the balloon from the screen
        balloon.kill();

        //  Add and update the score
        this.score += 10;
        scoreText.text = 'Score: ' + this.score;
    }

    function fireBullet(playerNumber) {
        if (currentTime() > this.playerBulletTime && playerNumber == 1) {
            bullet = this.bullets.getFirstExists(false);

            if (bullet) {
                bullet.reset(this.player.xPos() + 6, this.player.yPos() - 8);
                bullet.body.velocity.y = -300;
                this.playerBulletTime = currentTime() + 250;
            }
        } else if (currentTime() > this.secondPlayerBulletTime && playerNumber == 2) {
            bullet = this.bullets.getFirstExists(false);

            if (bullet) {
                bullet.reset(this.secondPlayer.xPos() + 6, this.player.yPos() - 8);
                bullet.body.velocity.y = -300;
                this.secondPlayerBulletTime = currentTime() + 250;
            }
        }
    }

    function spawnHeart(x, y) {
        heart = this.hearts.getFirstExists(false);
        heart.reset(x, y);
        heart.visible = false;

        return heart;
    }

    function spawnBonus(x, y) {
        var bonus = this.bonuses.create(x,y);

        return bonus;
    }

    function handleBonusOverlap(player, bonus) {
        switch (bonus.type) {
            case 'firstaid':
                if(player.lives < 3) {
                    player.lives++;
                    this.heartsArray[player.lives - 1].visible = true;
                }
                break;

            case 'diamond':
                this.score += 50;
                scoreText.text = 'Score: ' + this.score;
                break;

            default:
        }

        bonus.kill();
    }

    function endGame() {
        this.gameEnded = true;

        if( !isStayingAliveMode.call(this)) {
            this.timer.stop();
        }
        scoreText.destroy();

        new TextBuilder(game)
       .setText('Final score: ' + this.score)
       .up()
       .build();

       var menuButton = game.add.button(game.world.width / 2 - 40, game.world.height - 300,
           'menu_button', backToMenu.bind(this), this, 1, 0, 2);

        this.spaceKey.onDown.addOnce(backToMenu, this);
    }

    function chooseNextAction() {
        this.gameEnded = true;

        if( !isStayingAliveMode.call(this)) {
            this.timer.stop();
            this.timer.destroy();
        }
        new TextBuilder(game)
       .setText('Score after level ' + this.game.levels.current + ' : ' + this.score)
       .up()
       .build();

       var nextButton = game.add.button(game.world.width / 2 + 10, game.world.height - 300,
           'next_button', goToNextLevel.bind(this), this, 1, 0, 2);

        var menuButton = game.add.button(game.world.width / 2 - 80, game.world.height - 300,
            'menu_button', backToMenu.bind(this), this, 1, 0, 2);
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
        this.game.state.start("Main", true, false, this.mode, this.player.lives);
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

        if (this.enterKey.isDown && !this.gameEnded) {
            fireBullet.call(this, 1);
        }

        if(isMultiplayerMode.call(this)) {
            this.secondPlayer.resetMovement();
            if (this.aKey.isDown) {
                this.secondPlayer.moveLeft();
            } else if (this.dKey.isDown) {
                this.secondPlayer.moveRight();
            } else {
                this.secondPlayer.stop();
            }

            if (this.spaceKey.isDown && !this.gameEnded) {
                fireBullet.call(this, 2);
            }
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

      if( !isStayingAliveMode.call(this)) {
          var levelText = new TextBuilder(game)
          .setText('Level: ' + this.game.levels.current)
          .middle()
          .build();

          game.time.events.add(Phaser.Timer.SECOND, function() {
              levelText.destroy();
          }, this);
      }
    }

    function spawnBalloon() {
        var balloon = this.balloons.create(this.game.world.width/2 + game.rnd.integerInRange(-300, 300),
            25, 0);
        balloon.setLevel(game.rnd.integerInRange(0, 3));
    }

    function isMultiplayerMode() {
        return this.mode === 'multiplayer';
    }

    function isStayingAliveMode() {
        return this.mode === 'stayingAlive';
    }

    Main.prototype = {

        init: function(mode, lives) {
            this.lives = lives;
            this.mode = mode;
            this.gameEnded = false;
            this.playerBulletTime = 0;
            this.secondPlayerBulletTime = 0;
        },

        create: function() {
            if(!isStayingAliveMode.call(this)) {
                var levels = [level1, level2, level3];
                this.currentLevel = levels[game.levels.current - 1];
            }

            game.add.sprite(0, 0, 'sky');

            this.platforms = new Platforms(game);
            this.ground = this.platforms.createGround(0, game.world.height - 64);

            if(!isStayingAliveMode.call(this)) {
                this.timeBar = this.platforms.createTimeBar(0, game.world.height - 32);
            }

            if(!isMultiplayerMode.call(this)) {
                this.player = new Player(this.game, game.world.width / 2, game.world.height - 150, 'dude');
            } else {
                this.player = new Player(this.game, game.world.width / 2 - 64, game.world.height - 150, 'dude');
                this.secondPlayer = new Player(this.game, game.world.width / 2 + 64, game.world.height - 150, 'dude2');
            }
            if(this.lives) {
                this.player.setLives(this.lives);
            }

            this.balloons = new Balloons(game);
            this.bonuses = new Bonuses(game);

            if( !isStayingAliveMode.call(this) ) {
                this.balloons.createForConfig(this.currentLevel.balloons);
            } else {
                this.randomBalloonSpawnTimer = currentTime() + game.rnd.integerInRange(5000, 7000);
                spawnBalloon.call(this);
            }

            this.bullets = new Bullets(game);

            this.hearts = new Hearts(game);



            this.heartsArray = [spawnHeart.call(this, game.world.width - 45, 5),
            spawnHeart.call(this, game.world.width - 2*45, 5),
            spawnHeart.call(this, game.world.width - 3*45, 5)];

            for(var i = 0;i<this.player.lives;i++) {
                this.heartsArray[i].visible = true;
            }

            initText.call(this);

            // Used in update to prevent infinite collisions
            this.collisionDelay = 0;

            // Used in update to make blinking visible
            this.blinkDelay = 0;

            this.spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
            this.enterKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
            this.aKey = game.input.keyboard.addKey(Phaser.Keyboard.A);
            this.dKey = game.input.keyboard.addKey(Phaser.Keyboard.D);

            //  Stop the following keys from propagating up to the browser
            game.input.keyboard.addKeyCapture([Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT, Phaser.Keyboard.SPACEBAR,
                Phaser.Keyboard.ENTER, Phaser.Keyboard.A, Phaser.Keyboard.D]);

            if( !isStayingAliveMode.call(this)) {
                createTimeBar.call(this);
            }
        },

        update: function() {
            //  Collide the player and the balloons with the platforms
            game.physics.arcade.collide(this.player, this.platforms);
            game.physics.arcade.collide(this.balloons, this.platforms);
            game.physics.arcade.collide(this.bonuses, this.platforms);

            if(isMultiplayerMode.call(this)) {
                game.physics.arcade.collide(this.secondPlayer, this.platforms);
            }

            if (this.player.overlapWith(this.balloons)) {
                if (currentTime() > this.collisionDelay) {
                    this.player.endLife();
                    this.collisionDelay = currentTime() + 1000;

                    this.player.blinkCounter = 4;
                    this.player.isBlinking = this.player.blink();
                    this.blinkDelay = currentTime() + 250;

                    this.heartsArray[this.player.lives].kill();
                }
            }

            if (this.player.isBlinking == true && currentTime() > this.blinkDelay) {
                this.player.isBlinking = this.player.blink();
                this.blinkDelay = currentTime() + 250;
            }

            if(isMultiplayerMode.call(this)) {
                if (this.secondPlayer.overlapWith(this.balloons)) {
                    if (currentTime() > this.collisionDelay) {
                        this.player.endLife();
                        this.collisionDelay = currentTime() + 1000;

                        this.secondPlayer.blinkCounter = 4;
                        this.secondPlayer.isBlinking = this.secondPlayer.blink();
                        this.blinkDelay = currentTime() + 250;

                        this.heartsArray[this.player.lives].visible = false;
                    }
                }

                if (this.secondPlayer.isBlinking == true && currentTime() > this.blinkDelay) {
                    this.secondPlayer.isBlinking = this.secondPlayer.blink();
                    this.blinkDelay = currentTime() + 250;
                }
            }

            game.physics.arcade.overlap(this.player, this.bonuses, handleBonusOverlap, null, this);

            if(isMultiplayerMode.call(this)) {
                game.physics.arcade.overlap(this.secondPlayer, this.bonuses, handleBonusOverlap, null, this);
            }

            if (!this.player.isAlive() && !this.gameEnded) {
                endGame.call(this);
            } else if (!this.balloons.anyAlive() && !isStayingAliveMode.call(this) && !this.gameEnded) {
                chooseNextAction.call(this);
            }

            handleKeyboardInput.call(this);

            game.physics.arcade.overlap(this.bullets, this.balloons, hitBalloon, null, this);

            if(isStayingAliveMode.call(this) && this.randomBalloonSpawnTimer < currentTime() && !this.gameEnded) {
                spawnBalloon.call(this);

                this.randomBalloonSpawnTimer = currentTime() + game.rnd.integerInRange(5000, 7000);
            }
        }
    };

    return Main;
});
