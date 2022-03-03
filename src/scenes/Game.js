import Phaser from '../lib/phaser.js'


export default class Game extends Phaser.Scene {

    constructor() {
        super('game');
    }


    init() {
        this.pontuacao = 0
    }


    preload() {
        /* fazendo o carregamento das imagens */
        this.load.image('background', './src/sprites/background.png');
        this.load.image('dino', './src/sprites/dino.png');
    }
    

    create() {
        /* adcionando as imagens carregadas */
        this.add.image(512, 512, 'background');
        this.add.image(200, 650, 'dino').setScale(0.5);

        /* texto da pontuação */
        const style = { color: '#000', fontSize: 24 };
        this.textoPontuacao = this.add.text(800, 10, 'Pontuação: 0', style)
            .setScrollFactor(0)
            .setOrigin(0.5, 0)
        ;
    }

    
    update() {
        this.handlePontuacao();
    }


    handlePontuacao() {
        this.pontuacao++;
        this.textoPontuacao.text = `Pontuação: ${this.pontuacao}`;
    }
}