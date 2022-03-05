import Phaser from '../lib/phaser.js'

export default class Game extends Phaser.Scene {

    constructor() {
        super('game');
    }

    init() {
        this.score = 0;
    }

    preload() {
        /* fazendo o carregamento das imagens */
        this.load.image('background', './src/sprites/images/background2.png');
        this.load.image('dino', './src/sprites/images/dino.png');
    }
    
    create() {

        const style = { color: '#000', fontSize: 24 };

        /* adcionando as imagens carregadas */
        this.add.image(500, 250, 'background');
        this.add.image(200, 350, 'dino').setScale(0.3);

        /* texto da pontuação */
        this.scoreText = this.add.text(800, 50, 'Pontuação: 0', style)
            .setScrollFactor(0)
            .setOrigin(0.5, 0);       
    }

    update() {

        this.updateScore();
    }

    updateScore() {
        this.score++;
        this.scoreText.text = `Pontuação: ${this.pontuacao}`;
    }
}