import Phaser from '../lib/phaser.js'

export default class Start extends Phaser.Scene {

    constructor() {
        super('start');
    }


    preload() {
        /* fazendo o carregamento das imagens */
        this.load.image('background', './src/sprites/backgroundCastles.png');
        this.load.image('dinoRun', './src/sprites/dinoRun.png');
        this.load.image('spaceButton', './src/sprites/spaceButton.png');

        /* fazendo o carregamento dos sons */
        this.load.audio('startMusic', './src/sounds/startMusic.mp3');
    }


    create() {
        const width = this.scale.width; // largura do jogo
        const height = this.scale.height; // altura do jogo

        /* adcionando as imagens carregadas */
        this.add.image(512, 512, 'background');
        this.add.image(550, 550, 'dinoRun').setScale(0.5);
        this.button = this.add.image(width*0.5, (height*0.5)-200, 'spaceButton').setScale(1.2); // fazer piscar

        /* adicionando a musica inicial */
        this.sound.play('startMusic');

        const style = {
            color: '#000000',
            fontSize: 48
        };
        /* adicionando a frase na tela */
        this.add.text(width*0.5, (height*0.5)-300, 'Press SPACE to play', style)
            .setOrigin(0.5)
        ;

        /* se apertar espaço inicia a cena principal (Game) */
        this.input.keyboard.once('keydown-SPACE', () => {
            this.sound.stopAll(); // parar a música inicial
            this.scene.start('game');
        })

        /* fazendo o botão diminuir e aumentar de tamanho */
        setInterval(() => {
            if(this.button.scale == 1.2) {
                this.button.setScale(1.5);
            } else {
                this.button.setScale(1.2);
            }
        }, 400);
    }


    update() {
     
    }
}