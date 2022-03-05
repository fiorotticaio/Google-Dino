import Phaser from './lib/phaser.js'

/* importando as cenas */
import Game from './scenes/Game.js'
import Start from './scenes/Start.js'

export default new Phaser.Game({
    type: Phaser.AUTO,
    width: 1000,
    height: 500,
    scene: [Start, Game],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 1000
            },
            debug: true
        }
    }
})