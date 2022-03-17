import Phaser from '../lib/phaser.js'

export default class Start extends Phaser.Scene {

    constructor() {
        super('gameOver');
    }
    
    init(data) {
        this.pontuation = data.pts;
        this.timeScene = 0;
    }

    preload() {
        /* loading images */
        this.load.image('background', './src/sprites/backgroundCastles.png');

        /* loading audios */
        this.load.audio('gameOverMusic', './src/sounds/gameOverMusic.mp3');
    }


    create() {
        const width = this.scale.width; // game width
        const height = this.scale.height; // game height

        /* adding images */
        this.button = this.add.image(width*0.5, (height*0.5)-40, 'spaceButton').setScale(1.2); // it is not appearing
        this.background = this.add.tileSprite(850, 512, width, height, 'background').setScrollFactor(0, 0)

        /* adding the game over music */
        this.sound.play('gameOverMusic');

        const style = {
            color: '#000000',
            fontSize: 48
        };
        /* adding the text */
        this.add.text(width*0.5, (height*0.5)-300, 'Game Over', style).setOrigin(0.5);
        this.add.text(width*0.5, (height*0.5)-200, `Your pontuation was ${this.pontuation}`, style).setOrigin(0.5);
    }

    update() {
        /* play again */
        if (this.timeScene >= 150) { // 2 seconds
            this.sound.stopAll(); // stop the music
            this.scene.start('game');
        }
        this.timeScene++;
    }
}