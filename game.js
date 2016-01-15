var game = new Phaser.Game(800, 600, Phaser.AUTO);


var BootState = {
  preload: function() {
    game.load.image('preload', 'assets/loadbar.png')


  },

	create: function() {
		game.state.start('PreloadState')
	}
}

var PreloadState = {
	preload: function() {
		var preloadBar = game.add.sprite(game.world.centerX - 200, game.world.centerY, 'preload');
		var loadText = game.add.text(game.world.centerX, game.world.centerY - 100, "Game Loading...", { fontSize: '50px', fill: 'white',align: 'center' });
		loadText.anchor.setTo(0.5, 0.5);
		game.load.setPreloadSprite(preloadBar);


    game.load.physics('physics', 'assets/physics.json');
		game.load.image('platform4', 'assets/platform4.png');
		game.load.image('platform5', 'assets/platform5.png');
		game.load.image('platform6', 'assets/platform6.png');
		game.load.image('platform7', 'assets/platform7.png');
		game.load.image('pentagram', 'assets/pentagram.png');
		game.load.image('start', 'assets/start2.png');
    game.load.audio('odin', 'assets/odin4.mp3');
		game.load.image('robotstart', 'assets/robotstart2.png');
		game.load.spritesheet('explosion', 'assets/explosion.png', 64, 63);
		game.load.audio('dash', 'assets/dash.wav');
		game.load.audio('explosion', 'assets/explosion.wav');
    game.load.spritesheet('unicorn', 'assets/unicorn.png', 206, 110);
		game.load.spritesheet('dash', 'assets/unicorn.png', 479, 181);
		game.load.image('background1', 'assets/background1.png');
		game.load.image('mountain', 'assets/mountain.png');
		game.load.image('platform1', 'assets/platform1.png');
		game.load.image('platform2', 'assets/platform2.png');
		game.load.image('platform3', 'assets/platform3.png');

	},

	create: function() {
		game.state.start('GameState')
	}
}


var tilesprite;
var explosion;
var explosionSound;
var dashSound;
var player;
var playerMaterial;
var platforms;
var platform1;
var platform2;
var cursors;
var dashing = false;
var platformMaterial;
var pentagram;
var score = 0;
var scoreText;
var addScore = 100;
var velocity = -400;
var dead = false;
var jumpButton;
var dashButton;
var spaceButton;
var label;
var startScreen;
var startLogo;
var startText;
var startText2;
var startText3;
var start = false;

var GameState = {

	create: function() {



		game.physics.startSystem(Phaser.Physics.P2JS);

		game.physics.p2.gravity.y = 1000;
		game.physics.p2.friction = 0;
		game.physics.p2.restitution = 0;

		game.world.setBounds(0, -100, 800, 800);
		game.physics.p2.setBoundsToWorld(true, false, true, false);

		background = game.add.tileSprite(0, 100, 800, 700, 'background1');
		mountain = game.add.tileSprite(0, 100, 800, 700, 'mountain');

		playerMaterial = game.physics.p2.createMaterial('player');
		platformMaterial = game.physics.p2.createMaterial('platform');
		explosionMaterial = game.physics.p2.createMaterial('explosion');

		var playerPlatformCM = game.physics.p2.createContactMaterial(playerMaterial, platformMaterial);
		playerPlatformCM.restitution = 0;
		playerPlatformCM.friction = 0;
		playerPlatformCM.stiffness = 1000000;
		playerPlatformCM.damping = 0;
		playerPlatformCM.relaxation = 4;
		playerPlatformCM.contactSkinSize =  0;
		playerPlatformCM.frictionRelaxation = 4;
		playerPlatformCM.frictionStiffness = 1000000;

		var playerExplosionCM = game.physics.p2.createContactMaterial(playerMaterial, explosionMaterial);
		playerExplosionCM.contactSkinSize =  10000000;

		var music = game.add.audio('odin');
		music.loop = true;
		music.play();
		explosionSound = game.add.audio('explosion');
		dashSound = game.add.audio('dash');
		jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.Z);
		dashButton = game.input.keyboard.addKey(Phaser.Keyboard.X);
		spaceButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		scoreText = game.add.text(game.camera.view.width - 780, game.camera.view.y, 'score: ' + score, { fontSize: '32px', fill: 'white' });

		startScreen = game.add.sprite(0, 0, 'start');
		startLogo = game.add.sprite(80, 100, 'robotstart')
		startLogo.scale.setTo(1.1, 1.1)
		startText = game.add.text(150, 500, "Press Space to Start", { fontSize: '50px', fill: 'white',align: 'center' });
		startText2 = game.add.text(0, 350, "Your Death Awaits", { font: "papyrus",fontSize: '95px', fill: 'black',align: 'center' });
		startText3 = game.add.text(100, 450, "(Z) to jump, (X) to dash through obstacles", { fontSize: '30px', fill: 'white',align: 'center' });
	},




	update: function() {
		if (spaceButton.isDown && !start) {
			startScreen.destroy();
			startLogo.destroy();
			startText.destroy();
			startText2.destroy();
			startText3.destroy();
			start = true;
			this.startGame();
		}
		if (start) {
			game.world.bringToTop(scoreText);

			if (dead) {
				velocity = 0;
				// player.body.mass = 0
				player.body.kinematic = true;
				player.visible = false;
				player.alpha = 0;
			}

			if (player.body) player.body.x = 100;
			background.tilePosition.x -= 1;
			mountain.tilePosition.x -= 2;

			scoreText.position.y = game.camera.view.y
			if (pentagram.body) {
				pentagram.body.velocity.x = velocity;

			}

			if (dashButton.isDown && !dashing)
			{
				game.physics.p2.gravity.y = 0;
				if (player.body) player.body.velocity.y = 0;
				dashing = true;
				dashSound.play();
				player.loadTexture('dash');
				velocity -= 500;
				setTimeout(function () {
					game.physics.p2.gravity.y = 1000;
					player.loadTexture('unicorn');
					dashing = false;
					if (!dead) {
						velocity += 500
					} else {
						velocity = 0;
					}
				}, 500)
			}

			if (player.body && !dead && (this.checkIfCollidingY(player, platform1) || player.body.y > 800)) {
				if (!dead) this.die();
			}

			if (pentagram.body && player.body && this.checkIfCollidingX(player, pentagram) && !dashing) {
				if (!dead) this.die();
			} else if (pentagram.body && player.body && this.checkIfCollidingX(player, pentagram) && dashing) {
				explosionSound.play();
				explosion = game.add.sprite(pentagram.body.x, pentagram.body.y, 'explosion');
				explosion.scale.setTo(2, 2)
				explosion.animations.add('explode', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24], 25, true);
				explosion.animations.play('explode');

				game.physics.p2.enable([explosion], false);
				explosion.body.setMaterial(explosionMaterial);
				explosion.body.velocity.x = velocity;
				explosion.body.static = true;
				explosion.body.mass = 0;
				// explosion.body.kinematic = true;

				setTimeout(function () {
					explosion.destroy();
				}, 1000);

				var pentagramY = pentagram.body.y;
				pentagram.destroy();
				score += addScore;
				var plusScore = game.add.text(game.camera.view.x + 300, pentagramY, '+' + addScore, { fontSize: Math.log(addScore) / Math.log(4) * 8 + 'px', fill: 'white' });
				setTimeout(function () {
					plusScore.destroy();
				}, 1000)
				addScore += 100;
				scoreText.text = 'score: ' + score;

			}

			var pentagramPositions = {
				2: [game.world.width + 1170, game.world.height - 750],
				3: [game.world.width + 1670, game.world.height - 250],
				4: [game.world.width + 1470, game.world.height - 320],
				5: [game.world.width + 1470, game.world.height - 380],
				6: [game.world.width + 1700, game.world.height - 450],
				7: [game.world.width + 1450, game.world.height - 550],

			}

			if (platform1.position.x < -500) {
				var num = Math.round(Math.random() * (7 - 2) + 2);
				platform2 = game.add.sprite(game.world.width + 1200, game.world.height - 300, 'platform' + num);
				pentagram = game.add.sprite(pentagramPositions[num][0], pentagramPositions[num][1], 'pentagram')


				game.physics.p2.enable([platform2, pentagram], false);
				platform2.body.clearShapes();
				platform2.body.loadPolygon('physics', 'platform' + num, false);

				platform2.body.setMaterial(platformMaterial);

				velocity -= 30;
				platform2.body.static = true;
				pentagram.body.static = true;
				platform2.body.velocity.x = velocity;
				platform1 = platform2;
			}

			if (spaceButton.isDown && dead) {
				this.restartGame();
			}

			if (dashing) {

				player.animations.play('dash');
			} else {


				// player.animations.stop();
				player.animations.play('run');

			}


			if (jumpButton.isDown && player.body)
			{
				player.body.moveUp(400);
			} else {
				platform1.body.velocity.x = velocity;
			}

		}

	},

	checkIfCollidingY: function(object1, object2) {

		var yAxis = p2.vec2.fromValues(0, -1);
		var result = false;

		for (var i = 0; i < game.physics.p2.world.narrowphase.contactEquations.length; i++) {
			var c = game.physics.p2.world.narrowphase.contactEquations[i];

			if (c.bodyA === object1.body.data && c.bodyB === object2.body.data || c.bodyB === object1.body.data && c.bodyA === object2.body.data) {
				var d = p2.vec2.dot(c.normalA, yAxis); // Normal dot Y-axis
				if (c.bodyA === object1.body.data) d *= -1;
				if (d > 0.85) result = true;
			}
		}

		return result;

	},

	checkIfCollidingX: function(object1, object2) {

		var xAxis = p2.vec2.fromValues(1, 0);
		var result = false;

		for (var i = 0; i < game.physics.p2.world.narrowphase.contactEquations.length; i++)
		{
			var c = game.physics.p2.world.narrowphase.contactEquations[i];

			if (c.bodyA === object1.body.data && c.bodyB === object2.body.data || c.bodyB === object1.body.data && c.bodyA === object2.body.data)
			{
				var d = p2.vec2.dot(c.normalA, xAxis); // Normal dot Y-axis
				if (c.bodyA === object1.body.data) d *= -1;
				if (d > 0.999) result = true;
			}
		}

		return result;

	},

	startGame: function() {
		platform1 = game.add.sprite(800, 460, 'platform1');
		pentagram = game.add.sprite(1200, 280, 'pentagram');
		player = game.add.sprite(100, 260, 'unicorn');
		game.physics.p2.enable([player, pentagram, platform1], false);

		platform1.body.clearShapes();
		platform1.body.loadPolygon('physics', 'platform1');

		player.body.clearShapes();
		player.body.loadPolygon('physics', 'unicorn');

		player.body.restitution = 0;
		player.body.fixedRotation = true;
		platform1.body.restitution = 0;

		platform1.body.static = true;
		pentagram.body.static = true;
		platform1.body.data.gravityScale = 0;

		player.animations.add('run', [26, 25, 24, 23, 22, 21, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0], 50, true);
		player.animations.add('dash', [20, 21, 22,23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35], 30, true);

		game.camera.follow(player);

		player.body.setMaterial(playerMaterial);
		platform1.body.setMaterial(platformMaterial);
	},

	restartGame: function() {

		explosion.destroy();
		label.destroy();
		if (platform1) platform1.destroy();
		if (pentagram) pentagram.destroy();
		player.destroy();
		dead = false;
		velocity = -400;
		score = 0;
		addScore = 100;
		scoreText.text = 'score: ' + score;
		this.startGame();

	},

	die: function() {
		dead = true;
		game.camera.follow(null);
		explosionSound.play();
		explosion = game.add.sprite(player.body.x - 60, player.body.y - 60, 'explosion');
		explosion.scale.setTo(2, 2);
		explosion.animations.add('explode', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24], 30, false);
		explosion.animations.play('explode');
		label = game.add.text(game.camera.view.x + 400, game.camera.view.y + 300, 'Your Score: '+ score +'\nGAME OVER\nPress SPACE to restart',{ font: '30px Lucida Console', fill: '#fff', align: 'center'});
		label.anchor.setTo(0.5, 0.5);
	}
}

game.state.add('BootState', BootState,true);
game.state.add('PreloadState', PreloadState);
game.state.add('GameState', GameState);
game.state.start('BootState')
