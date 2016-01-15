var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

var BootState = {
  function preload() {
    game.load.image('preload', 'assets/platform')
  },
}
