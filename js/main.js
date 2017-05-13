var Main = function(game){

    this.score = 0;
    this.bulletTime = 0;

};

Main.prototype = {

    create: function() {

        //  A simple background for our game
        game.add.sprite(0, 0, 'sky');

        platforms = game.add.group();
        platforms.enableBody = true;        //  We will enable physics for any object that is created in this group

        ground = platforms.create(0, game.world.height - 64, 'ground');
        ground.scale.setTo(2, 2);           //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
        ground.body.immovable = true;       //  This stops it from falling away when you jump on it

        // The player and its settings
        this.player = new Player(this.game, game.world.width/2, game.world.height - 150);

        balloons = game.add.group();
        balloons.enableBody = true;

        //  Create a balloon inside of the 'balloons' group
        balloon = balloons.create(Math.random() * 800, 0, 'balloon');

        balloon.level = 2;
        balloon.body.gravity.y = 60;
        balloon.body.bounce.y = 0.4 + Math.random() * 0.2;     //  This just gives each balloon a slightly random bounce value
        balloon.body.collideWorldBounds = true;
        balloon.scale.setTo(balloon.level + 0.5, balloon.level + 0.5);

        bullets = game.add.group();
        bullets.enableBody = true;
        bullets.physicsBodyType = Phaser.Physics.ARCADE;
        bullets.createMultiple(10, 'bullet');
        bullets.callAll('events.onOutOfBounds.add', 'events.onOutOfBounds', this.resetBullet, this);
        bullets.setAll('checkWorldBounds', true);

        scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

        this.spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        //  Stop the following keys from propagating up to the browser
        game.input.keyboard.addKeyCapture([ Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT, Phaser.Keyboard.SPACEBAR ]);
    },


    update: function() {
        //  Collide the player and the balloons with the platforms
        game.physics.arcade.collide(this.player, platforms);
        game.physics.arcade.collide(balloons, platforms);

        var hitPlayer = game.physics.arcade.collide(balloons, this.player);

        if(hitPlayer || balloons.total == 0) {
            this.endGame();
        }

        var cursors = game.input.keyboard.createCursorKeys();

        //  Reset the players velocity (movement)
        this.player.resetMovement();
        if (cursors.left.isDown)
        {
            //  Move to the left
            this.player.moveLeft();
        }
        else if (cursors.right.isDown)
        {
            //  Move to the right
            this.player.moveRight();
        }
        else
        {
            //  Stand still
            this.player.stop();
        }

        if (this.spaceKey.isDown)
        {
            this.fireBullet();
        }

        game.physics.arcade.overlap(bullets, balloons, this.hitBalloon, null, this);
    },

    hitBalloon: function(bullet, balloon) {

        // Removes the balloon from the screen
        bullet.kill();

        if( balloon.level > 0 ) {

            var firstNewBalloon = balloons.create(balloon.body.x - Math.random() * 50 + Math.random() * 50,
                                                balloon.body.y - Math.random() * 25 + Math.random() * 25, 'balloon');
            var secondNewBalloon = balloons.create(balloon.body.x - Math.random() * 50 + Math.random() * 50,
                                                balloon.body.y - Math.random() * 25 + Math.random() * 25, 'balloon');

            firstNewBalloon.level = secondNewBalloon.level = --balloon.level;
            firstNewBalloon.body.velocity.y = secondNewBalloon.body.velocity.y = 60;
            firstNewBalloon.body.bounce.y = secondNewBalloon.body.bounce.y = 0.4 + Math.random() * 0.2;
            firstNewBalloon.body.collideWorldBounds = secondNewBalloon.body.collideWorldBounds = true;
            firstNewBalloon.scale.setTo(balloon.level + 0.5, balloon.level + 0.5);
            secondNewBalloon.scale.setTo(balloon.level + 0.5, balloon.level + 0.5);
        }

        balloon.kill();

        //  Add and update the score
        this.score += 10;
        scoreText.text = 'Score: ' + this.score;
    },

    fireBullet: function () {

        if (game.time.now > this.bulletTime)
        {
            bullet = bullets.getFirstExists(false);

            if (bullet)
            {
                bullet.reset(this.player.body.x + 6, this.player.body.y - 8);
                bullet.body.velocity.y = -300;
                this.bulletTime = game.time.now + 250;
            }
        }
    },

    //  Called if the bullet goes out of the screen
    resetBullet: function(bullet) {
        bullet.kill();
    },

    endGame: function() {
        scoreText.text = '';

        var finalScoreText = game.add.text(game.world.width/2 - 100, game.world.height/2,
                            'Final score: ' + this.score, { fontSize: '32px', fill: '#000' });

        var restartText = game.add.text(game.world.width/2 - 275, game.world.height - 55,
                            'Press \'Space\' to get back to menu screen');

        this.spaceKey.onDown.addOnce(this.backToMenu, this);
	},

    backToMenu: function() {

        this.score = 0;

        this.game.state.start("Menu");
    },
};
