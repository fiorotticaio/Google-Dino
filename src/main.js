import Phaser from './lib/phaser.js'

/* importando as cenas */
import Game from './scenes/Game.js'
import Start from './scenes/Start.js'
import GameOver from './scenes/GameOver.js'

export default new Phaser.Game({
    type: Phaser.AUTO,
    width: 1700,
    height: 1024,
    scene: [Start, Game, GameOver],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 1000
            },
            debug: false
        }
    }
})