import Phaser from '../lib/phaser.js'

export default class Start extends Phaser.Scene {

    constructor() {
        super('start');
    }


    preload() {
        /* loading images */
        this.load.image('background', './src/sprites/backgroundCastles.png');
        this.load.image('dinoRun', './src/sprites/dinoRun.png');
        this.load.image('spaceButton', './src/sprites/spaceButton.png');

        /* loading audios */
        this.load.audio('startMusic', './src/sounds/startMusic.mp3');
    }


    create() {
        const width = this.scale.width; // game width
        const height = this.scale.height; // game height

        /* adding images */
        this.background = this.add.tileSprite(850, 512, width, height, 'background').setScrollFactor(0, 0)
        this.add.image(900, 550, 'dinoRun').setScale(0.5);
        this.button = this.add.image(width*0.5, (height*0.5)-200, 'spaceButton').setScale(1.2);

        /* adding the game over music */
        this.sound.play('startMusic');

        const style = {
            color: '#000000',
            fontSize: 48
        };
        /* adding the text */
        this.add.text(width*0.5, (height*0.5)-300, 'Press SPACE to play', style).setOrigin(0.5);

        /* play game */
        this.input.keyboard.once('keydown-SPACE', () => {
            this.sound.stopAll(); // stop music
            this.scene.start('game');
        })

        /* changing the size of the button */
        setInterval(() => {
            if(this.button.scale == 1.2) {
                this.button.setScale(1.5);
            } else {
                this.button.setScale(1.2);
            }
        }, 400);
    }
}