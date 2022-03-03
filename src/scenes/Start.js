import Phaser from '../lib/phaser.js'

export default class Start extends Phaser.Scene {

    constructor() {
        super('start');
    }


    preload() {
        /* fazendo o carregamento das imagens */
        this.load.image('background', './src/sprites/background.png');
        this.load.image('dino', './src/sprites/dino.png');
        this.load.image('botaoEspaco', './src/sprites/botaoEspaco.png');

        /* fazendo o carregamento dos sons */
        this.load.audio('startMusic', './src/sprites/startMusic.mp3');
    }


    create() {
        const width = this.scale.width; // largura do jogo
        const height = this.scale.height; // altura do jogo

        /* adcionando as imagens carregadas */
        this.add.image(512, 512, 'background');
        this.add.image(200, 650, 'dino').setScale(0.5);
        this.add.image(width*0.5, (height*0.5)-200, 'botaoEspaco').setScale(1.2); // fazer piscar

        /* adicionando a musica inicial */
        this.sound.play('startMusic');

        const style = {
            color: '#000000',
            fontSize: 48
        };
        /* adicionando a frase na tela */
        this.add.text(width*0.5, (height*0.5)-300, 'Pressione ESPAÇO para iniciar', style)
            .setOrigin(0.5)
        ;

        /* se apertar espaço inicia a cena principal (Game) */
        this.input.keyboard.once('keydown-SPACE', () => {
            this.sound.stopAll(); // parar a música inicial
            this.scene.start('game');
        })
    }
}